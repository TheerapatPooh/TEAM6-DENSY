"use client";
import { FilterComment, IComment, itemType } from "@/app/type";
import BadgeCustom from "@/components/badge-custom";
import { DatePickerWithRange } from "@/components/date-picker";
import Loading from "@/components/loading";
import Textfield from "@/components/textfield";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchData,
  getInitials,
  getItemTypeVariant,
  sortData,
} from "@/lib/utils";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { formatTime } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { AlertCustom } from "@/components/alert-custom";
import { toast } from "@/hooks/use-toast";

export default function Page() {
  const t = useTranslations("General");
  const s = useTranslations("Status");
  const z = useTranslations("Zone");
  const a = useTranslations("Alert");

  const [loading, setLoading] = useState<boolean>(true);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allComments, setAllComments] = useState<IComment[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const handleDialogResult = (result: boolean) => {
    setIsDialogOpen(false);
    if (result && pendingAction) {
      pendingAction(); // Execute the pending action
      setPendingAction(null); // Clear the pending action
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const getAllComments = async () => {
    try {
      const queryString = buildQueryString(filter, searchTerm);
      console.log(queryString);
      const data = await fetchData("get", `/comments?${queryString}`, true);
      setAllComments(data);
    } catch (error) {
      console.error("Failed to fetch patrol data:", error);
    }
  };

  const handleConfirmComment = (id) => {
    setPendingAction(() => () => confirmComment(id));
    handleOpenDialog();
  };

  const confirmComment = async (id) => {
    try {
      await fetchData("put", `/comment/${id}`, true);
      setAllComments((prev) =>
        prev.map((comment) =>
          comment.id === id ? { ...comment, status: true } : comment
        )
      );
      toast({
        variant: "success",
        title: a("ConmmentConfirmSuccessTitle"),
        description: a("ConmmentConfirmSuccessDescription"),
      });
    } catch (error) {
      console.error("Error deleting patrol:", error);
    }
  };

  const handleSortChange = (type: string, value: string) => {
    setSort((prevSort) => ({
      ...prevSort,
      [type]: value,
    }));
  };

  const commentStatus = ["completed", "pending"];

  const initialFilter = {
    commentStatus: "All",
    dateRange: { start: undefined, end: undefined },
  };

  const getStoredFilter = () => {
    if (typeof window !== "undefined") {
      const storedFilter = localStorage.getItem("commentFilter");
      if (storedFilter) {
        return JSON.parse(storedFilter);
      }
    }
    return initialFilter;
  };

  const [filter, setFilter] = useState<FilterComment | null>(getStoredFilter());

  const [sort, setSort] = useState<{ by: string; order: string }>({
    by: "Date",
    order: "Ascending",
  });

  const applyFilter = () => {
    getAllComments();
  };

  const resetFilter = () => {
    setFilter(initialFilter);
  };

  const handleDateSelect = (dateRange: DateRange) => {
    const startDate = dateRange.from ?? null;
    const endDate = dateRange.to
      ? new Date(new Date(dateRange.to).setHours(23, 59, 59, 999))
      : null;
    setFilter({
      commentStatus: filter?.commentStatus || null,
      dateRange: {
        start: startDate || undefined,
        end: endDate || undefined,
      },
    });
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const buildQueryString = (
    filter: FilterComment | null,
    searchTerm: string
  ) => {
    const params: Record<string, string | undefined> = {};

    // เพิ่ม search term ถ้ามี
    if (searchTerm) params.search = searchTerm;

    // เพิ่ม status filter ถ้าไม่ใช่ "All"
    if (filter?.commentStatus && filter.commentStatus !== "All") {
      params.status = filter.commentStatus === "completed" ? "true" : "false";
    }

    // เพิ่ม startDate
    if (filter?.dateRange?.start) {
      params.startDate = filter?.dateRange.start.toISOString();
    }

    // เพิ่ม endDate
    if (filter?.dateRange?.end) {
      params.endDate = filter?.dateRange?.end.toISOString();
    }

    return new URLSearchParams(params).toString();
  };

  useEffect(() => {
    getAllComments();
    setLoading(false);
  }, []);

  useEffect(() => {
    getAllComments();
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem("commentFilter", JSON.stringify(filter));
  }, [filter]);

  useEffect(() => {
    const sortedData = sortData(allComments, sort);
    if (JSON.stringify(sortedData) !== JSON.stringify(allComments)) {
      setAllComments(sortedData);
    }
  }, [sort, allComments]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Textfield
          iconName="search"
          showIcon={true}
          placeholder={t("Search")}
          onChange={handleSearch}
        />

        <DropdownMenu onOpenChange={(open) => setIsSortOpen(open)}>
          <DropdownMenuTrigger
            className={`custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium 
          ${isSortOpen ? "border border-destructive" : "border-none"}`}
          >
            <span className="material-symbols-outlined">swap_vert</span>
            <div className="text-lg">{t("Sort")}</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-2 gap-2">
            <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
              {t("SortBy")}
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={sort.by}
              onValueChange={(value) => handleSortChange("by", value)}
            >
              <DropdownMenuRadioItem
                value="Date"
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                {t("Date")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="Status"
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                {t("Status")}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
              {t("Order")}
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={sort.order}
              onValueChange={(value) => handleSortChange("order", value)}
            >
              <DropdownMenuRadioItem
                value="Ascending"
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                {t("Ascending")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="Descending"
                className="text-base"
                onSelect={(e) => e.preventDefault()}
              >
                {t("Descending")}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu onOpenChange={(open) => setIsFilterOpen(open)}>
          <DropdownMenuTrigger
            className={`custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium 
          ${isFilterOpen ? "border border-destructive" : "border-none"}`}
          >
            <span className="material-symbols-outlined">page_info</span>
            <div className="text-lg">{t("Filter")}</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="flex flex-col justify-center gap-2 p-2 z-50"
            align="end"
          >
            <div>
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                {t("Date")}
              </DropdownMenuLabel>
              <DatePickerWithRange
                startDate={filter?.dateRange.start}
                endDate={filter?.dateRange.end}
                onSelect={handleDateSelect}
                className="my-date-picker"
              />
            </div>
            <div>
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                {t("Status")}
              </DropdownMenuLabel>
              <Select
                value={filter?.commentStatus || "All"}
                onValueChange={(value) =>
                  setFilter({
                    commentStatus: value,
                    dateRange: {
                      start: filter?.dateRange.start,
                      end: filter?.dateRange.end,
                    },
                  })
                }
              >
                <SelectTrigger className="">
                  <SelectValue
                    placeholder={
                      filter?.commentStatus === "All"
                        ? t("All")
                        : filter?.commentStatus
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("Status")}</SelectLabel>
                    <SelectItem value="All">{t("All")}</SelectItem>
                    {commentStatus.map((status) => (
                      <SelectItem value={status} key={status}>
                        {s(status)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full justify-end mt-4 gap-2">
              <Button size="sm" variant="secondary" onClick={resetFilter}>
                {t("Reset")}
              </Button>
              <Button size="sm" variant="primary" onClick={applyFilter}>
                {t("Apply")}
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("Message")}</TableHead>
            <TableHead className="w-[180px]">{t("Date")}</TableHead>
            <TableHead className="w-[240px]">{t("Status")}</TableHead>
            <TableHead className="w-[240px]">{t("Inspector")}</TableHead>
            <TableHead className="text-end w-[10px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allComments.map((comment, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{comment.message}</TableCell>
              <TableCell className="font-medium">
                {formatTime(comment.timestamp)}
              </TableCell>
              <TableCell className="font-medium">
                <BadgeCustom
                  variant={comment.status === false ? "blue" : "green"}
                  iconName={
                    comment.status === false ? "hourglass_top" : "check"
                  }
                  showIcon={true}
                >
                  {s(comment.status === false ? "pending" : "completed")}
                </BadgeCustom>
              </TableCell>
              <TableCell className="font-medium flex flex-row gap-2 items-center">
                {comment.user.profile.name ? (
                  <Avatar>
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${comment.user.profile.image?.path}`}
                    />
                    <AvatarFallback>
                      {getInitials(comment.user.profile.name)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Skeleton className="h-12 w-12 rounded-full bg-input" />
                )}
                <div>
                  {comment.user.profile.name ? (
                    comment.user.profile.name
                  ) : (
                    <div className="text-destructive">
                      {comment.user.username}
                      <div className="text-[14px]">No profile is provided</div>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" className="w-[45px] h-[45px]">
                      <span className="material-symbols-outlined items-center text-input">
                        more_horiz
                      </span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="p-0">
                    <DropdownMenuItem className="p-0">
                      <AlertDialog>
                        <AlertDialogTrigger
                          asChild
                          className="pl-2 py-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            className="cursor-pointer w-full h-full flex"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            {t("Detail")}
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="px-6 py-4 gap-4">
                          <div className="flex flex-col gap-2">
                            <p className="text-lg font-semibold text-muted-foreground">
                              {formatTime(comment.timestamp)}
                            </p>
                            <p className="text-2xl font-bold text-card-foreground">
                              {
                                comment.patrolResult.itemZone.item.checklist
                                  .title
                              }
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="text-xl text-muted-foreground">
                              {comment.patrolResult.itemZone.item.name}
                            </p>
                            <div className="flex items-center gap-1 text-base text-muted-foreground">
                              <span className="material-symbols-outlined">
                                location_on
                              </span>
                              <p>
                                {z(comment.patrolResult.itemZone.zone.name)}
                              </p>
                            </div>
                          </div>
                          <BadgeCustom
                            variant={
                              getItemTypeVariant(
                                comment.patrolResult.itemZone.item
                                  .type as itemType
                              ).variant
                            }
                            shape="square"
                            showIcon={true}
                            iconName={
                              getItemTypeVariant(
                                comment.patrolResult.itemZone.item
                                  .type as itemType
                              ).iconName
                            }
                          >
                            {s(comment.patrolResult.itemZone.item.type)}
                          </BadgeCustom>

                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={(e) => e.stopPropagation()}
                            >
                              {t("Close")}
                            </AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuItem>
                    {isDialogOpen && (
                      <AlertCustom
                        title={a("ConfirmCommentTitle")}
                        description={a("ConfirmCommentDescription")}
                        primaryButtonText={t("Confirm")}
                        primaryIcon="check"
                        primaryVariant="primary"
                        secondaryButtonText={t("Cancel")}
                        backResult={handleDialogResult}
                      ></AlertCustom>
                    )}
                    <DropdownMenuItem
                      className="cursor-pointer w-full h-full flex"
                      disabled={comment.status === true}
                      onClick={(e) => {
                        e.preventDefault();
                        handleConfirmComment(comment.id);
                        e.stopPropagation();
                      }}
                    >
                      <p className="text-primary">{t("Resolve")}</p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
