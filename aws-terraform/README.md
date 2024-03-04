Create a .tf file called variable.tf

And populate the file with the terraform code below

variable "provider_region" {
  type    = string
  default = "us-east-2"
}

variable "provider_access_key" {
  type    = string
  default = ""
}

variable "provider_secret_key" {
  type    = string
  default = ""
}


Run 'terraform plan' to see the potential changes and use 'terraform apply' to create all resources on your aws account.