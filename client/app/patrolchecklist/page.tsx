import PatrolChecklist from "@/components/patrol-checklist"

export default function Page() {
  return(
    <div className="">
        <PatrolChecklist id={0} title={""} description={""} version={0} latest={false} updated_at={""} updated_by={0} checklists={[]}/>
    </div>
  );
}