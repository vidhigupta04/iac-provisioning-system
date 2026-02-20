provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "agri_server" {
  ami           = "ami-0c55b159cbfafe1f0" # Ubuntu 22.04
  instance_type = "t2.micro"

  tags = {
    Name = "AgriConnect-Server"
  }
}