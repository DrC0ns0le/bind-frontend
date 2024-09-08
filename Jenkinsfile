pipeline {
    agent {
        kubernetes {
            yamlFile 'kaniko-builder.yml'
        }
    }

    environment {
        DOCKER_REGISTRY = "registry.internal.leejacksonz.com"
        DOCKER_IMAGE = "bind-frontend"
        DOCKER_TAG = "${env.GIT_BRANCH.replaceAll('/', '-')}-${env.GIT_COMMIT.take(7)}"
    }
    stages {
        stage('Build and Push Docker Image') {
            steps {
                container('kaniko') {
                    script {
                        sh """
                            /kaniko/executor \
                              --context . \
                              --destination ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG} \
                              --dockerfile Dockerfile \
                              --insecure
                        """
                        
                        if (env.GIT_BRANCH == 'main' || env.GIT_BRANCH == 'master') {
                            sh """
                                /kaniko/executor \
                                  --context . \
                                  --destination ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest \
                                  --dockerfile Dockerfile \
                                  --insecure
                            """
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}