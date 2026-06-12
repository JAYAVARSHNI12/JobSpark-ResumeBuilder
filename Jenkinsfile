pipeline {
    agent any

    environment {
        REGISTRY   = 'docker.io/jayavarshni'   // CHANGE THIS
        IMAGE_NAME = 'jobspark-resume-builder'
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat """
                    docker build -t ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} .
                """
            }
        }

        stage('Push Docker Image') {
            steps {
                bat """
                    docker login -u jayavarshni -p dckr_pat_FRveGQDXSYfUpoEvgMOs2_XtWNo ${REGISTRY}
                    docker push ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                    docker push ${REGISTRY}/${IMAGE_NAME}:latest
                """
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded!"
        }
        failure {
            echo "Pipeline failed."
        }
    }
}
