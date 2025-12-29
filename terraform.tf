terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "spandan_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
  tags = {
    Name = "spandan_vpc"
  }
}

resource "aws_subnet" "spandan_subnet" {
  vpc_id = aws_vpc.spandan_vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  map_public_ip_on_launch = true
  tags = {
    Name = "spandan_subnet"
  }
}

resource "aws_internet_gateway" "spandan_igw" {
  vpc_id = aws_vpc.spandan_vpc.id
  tags = {
    Name = "spandan_igw"
  }
}

resource "aws_route_table" "spandan_rt" {
  vpc_id = aws_vpc.spandan_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.spandan_igw.id
  }
  tags = {
    Name = "spandan_rt"
  }
}

resource "aws_route_table_association" "spandan_myvpc_public_rta" {
  subnet_id = aws_subnet.spandan_subnet.id
  route_table_id = aws_route_table.spandan_rt.id
}

resource "aws_security_group" "spandan_sg" {
  name        = "spandan_sg"
  description = "Allow SSH and HTTP"
  vpc_id      = aws_vpc.spandan_vpc.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 8081
    to_port = 8081
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "spandan_sg"
  }
}

resource "aws_instance" "spandan_ec2" {
  ami = "ami-0c02fb55956c7d316"
  instance_type = "t3.micro"
  subnet_id = aws_subnet.spandan_subnet.id
  vpc_security_group_ids = [aws_security_group.spandan_sg.id]
  key_name = "spandan-backend"
  associate_public_ip_address = true
  
  user_data = <<-EOF
              #!/bin/bash
              set -e
              
              # Log output to file for debugging
              exec > >(tee /var/log/user-data.log)
              exec 2>&1
              
              echo "Starting user data script..."
              
              # Update system packages
              echo "Updating system packages..."
              yum update -y
              
              # Install Git
              echo "Installing Git..."
              yum install git -y
              
              # Install Docker
              echo "Installing Docker..."
              yum install docker -y
              
              # Start Docker service
              echo "Starting Docker service..."
              systemctl start docker
              systemctl enable docker
              
              # Add ec2-user to docker group
              usermod -a -G docker ec2-user
              
              # Install Docker Compose
              echo "Installing Docker Compose..."
              curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose
              
              # Create a directory for the application
              echo "Creating application directory..."
              mkdir -p /home/ec2-user/app
              cd /home/ec2-user/app
              
              # Clone the repository (using HTTPS)
              echo "Cloning repository..."
              git clone https://github.com/spandanxbhattarai/spandana-bhattarai.git .
              
              # Run Docker Compose
              echo "Running Docker Compose..."
              docker-compose up -d
              
              # Set proper ownership
              chown -R ec2-user:ec2-user /home/ec2-user/app
              
              echo "User data script completed successfully!"
              EOF
  
  tags = {
    Name = "spandan_ec2"
  }
}