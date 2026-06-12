 pipeline {

    agent any

    tools {
        maven 'Maven'
        jdk 'JDK21'
    }

    stages {

        stage('Clone Repository') {

            steps {

                git branch: 'main',
                url: 'https://github.com/JAYAVARSHNI12/resume-builder-devops-project.git'

            }
        }

        stage('Build Java Project') {

            steps {

                bat 'mvn clean package'

            }
        }

        stage('Verify Jar File') {

            steps {

                bat 'dir target'

            }
        }

        stage('Build Docker Image') {

            steps {

                bat 'docker build -t resume-builder-app .'

            }
        }

        stage('Remove Old Container') {

            steps {

                bat 'docker rm -f resume-container || exit 0'

            }
        }

        stage('Run Docker Container') {

            steps {

                bat 'docker run -d -p 2020:80 --name resume-container resume-builder-app'

            }
        }
    }
}
