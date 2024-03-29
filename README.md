demo: https://drive.google.com/file/d/1f0GsbI6e1q4FyJVUPIZj1CMEGBosYzDL/view?usp=sharing

Architecture and workflow:
![Architecture](https://github.com/jLiucoder/nova-vercelClone/blob/main/nova-architecture.png)


set up instruction:

1. Go to terraform folder and create a provider file called variable.tf, fill it in like this
   ```
   variable "provider_region" {
       type    = string
       default = ""
   }
   variable "provider_access_key" {
       type    = string
       default = ""
   }
   variable "provider_secret_key" {
       type    = string
       default = ""
   }
   ```
2. Run
   `terraform plan`
   to see the upcoming changes, and run
   `terraform apply`
   to apply the changes and wait to finish
3. Filling in the access key and secret access key in deploy-server/index.js, and create a new image and push it to ECR
4. Create cluster with Fargate in ECS
5. Create new task definition with the uploaded image in ECR
6. Then everything should be working and setting up.
7. Remember to run ```terraform destroy``` to take down all the services once down to avoid cost. 
