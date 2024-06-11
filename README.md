#### Thought Process

- Create Base EC2 Instance
- Create AMI from instance
- Terminate base instance
- Create Launch Template
- Create Target Group
- Create Load Balancer
- Create Auto Scaling Group (Let it use latest Launch Template Version)

On new deploy

- Update Launch Template (This creates a new template version)
- Delete Old Template but leave the last 2
- Start instance refresh on ASG

For Envs Use Parameter Store

- On new instance launch (life cycle hook), load this envs to .bashrc
