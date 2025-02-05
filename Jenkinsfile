pipeline {
    agent any

    triggers {
        pollSCM('H 0 * * *')
    }
   
    stages {
        stage('Check Docker') {
            steps {
                sh 'docker-compose --version'
            }
        }

        stage('Pull Latest Code') {
            steps {
                dir('/workspace/TEAM6-DENSY') {
                    sh '''
                    git config --global --add safe.directory /workspace/TEAM6-DENSY
                    git pull origin main
                    '''
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('/workspace/TEAM6-DENSY/server') {
                    sh '''
                    npm install
                    npm run test || exit 1
                    '''
                }
            }
        }

        stage('Cleanup Existing Containers') {
            steps {
                dir('/workspace/TEAM6-DENSY') {
                    sh """
                    docker-compose down || true
                    """
                }
            }
        }


        stage('Build and Deploy') {
            steps {
                dir('/workspace/TEAM6-DENSY') {
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }

    post {
        always {
            node('') {
                echo "Cleaning workspace..."
                cleanWs()
            }
        }
    }
}
