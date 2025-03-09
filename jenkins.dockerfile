# ใช้ภาพ Jenkins LTS เป็นฐาน
FROM jenkins/jenkins:lts

# เปลี่ยนเป็นผู้ใช้ root เพื่อทำการติดตั้ง
USER root

# อัพเดตแพ็กเกจและติดตั้ง Docker
RUN apt-get update && \
    apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    echo "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y docker-ce docker-ce-cli containerd.io && \
    rm -rf /var/lib/apt/lists/*

# ติดตั้ง Docker Compose
RUN curl -SL https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# ติดตั้ง Node.js และ npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# เพิ่มผู้ใช้ Jenkins ไปยังกลุ่ม Docker เพื่อให้สามารถใช้งาน Docker ได้
RUN usermod -aG docker jenkins

# เปลี่ยนกลับไปเป็นผู้ใช้ Jenkins
USER jenkins