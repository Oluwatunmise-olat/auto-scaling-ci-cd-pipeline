# Application Deployment Process (THE HARD WAY WITHOUT AWS CODE DEPLOY)

## Thought Process Overview

1. **Create Application Load Balancer Security Group**
2. **Create EC2 Security Group**
3. **Create AWS SSM Role (Systems Manager)**
4. **Create Launch Template**
5. **Add Application Script in User Data of Launch Template**
6. **Create Target Group**
7. **Create Application Load Balancer**
8. **Create Auto Scaling Group**

## Detailed Process

### Step 1: Create Launch Template

1. Navigate to the **EC2 Dashboard** in the AWS Management Console.
2. Select **Launch Templates** from the left-hand menu.
3. Click on **Create launch template**.
4. Enter the required details:
   - **Launch template name**: Enter a unique name for the template.
   - **Template version description**: Optionally, provide a version description.
   - **AMI ID**: Select the Amazon Machine Image (AMI) you want to use.
   - **Instance type**: Choose the appropriate instance type for your application.
   - **Key pair**: Select an existing key pair or create a new one.
   - **Assume Role**: Assume AWS SSM Role within the `Advanced Details` section
5. (Optional) Add **Network Settings** like VPC, Subnet, Security Groups.
6. Expand the **Advanced Details** section.
7. In the **User data** field, enter your setup script (check `scripts/userdata.sh`).

### Step 2: Add Application Script in User Data of Launch Template

1. Within the **Advanced Details** section, locate the **User data** field.
2. Add your setup script. Example: `scripts/userdata.sh` which setups and deploys your application

### Step 3: Create Target Group

1. Navigate to the EC2 Dashboard.
2. Select Target Groups from the left-hand menu.
3. Click on Create target group.
4. Configure the target group settings:
5. Target type: Select Instances.
6. Target group name: Enter a unique name.
7. Protocol: Choose HTTP.
8. Port: Enter the port your application listens on (e.g., 3000).
9. VPC: Select the appropriate VPC.
10. Create VPC

### Step 4: Create Application Load Balancer

1. Navigate to the EC2 Dashboard.
2. Select Load Balancers from the left-hand menu.
3. Click on Create Load Balancer and choose Application Load Balancer.
4. Configure the load balancer settings:
5. Name: Enter a unique name.
6. Scheme: Select Internet-facing or Internal based on your requirements.
7. IP address type: Choose ipv4.
8. Listeners: Ensure a listener is set to port 80.
9. Configure Security Groups to control traffic.
10. Under Listeners and routing, set the default action to forward requests to your target group.
11. Click on Create.

### Step 5: Create Auto Scaling Group

1. Navigate to the EC2 Dashboard.
2. Select Auto Scaling Groups from the left-hand menu.
3. Click on Create Auto Scaling group.
4. Configure the Auto Scaling group settings:
5. Auto Scaling group name: Enter a unique name.
6. Launch template: Select the launch template created earlier.
7. Launch template version: Choose `Latest`.
8. Specify the VPC and Subnets for the Auto Scaling group.
9. Set the desired capacity, minimum, and maximum number of instances.
10. Enable Instance Refresh and ensure it uses 100% new instance availability before terminating existing instances.
11. Click on Create Auto Scaling group.

## Continuous Deployment Process (Rolling update)

1. Start Instance Refresh

```bash
  aws autoscaling start-instance-refresh --auto-scaling-group-name ${{ secrets.AUTO_SCALING_GROUP_NAME }} --preferences '{"InstanceWarmup":60, "MinHealthyPercentage":100}'
```
