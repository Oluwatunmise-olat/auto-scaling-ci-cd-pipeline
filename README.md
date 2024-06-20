#### Thought Process

- Create Launch Template
- Add app script in user data of launch template for setting up your application
- Create target group to route requests to the port your app is listening on
- Create Application Load Balancer to listen to requests on port 80 and route to your target group
- Create auto scaling group (Let it use latest Launch Template Version)

On new deploy

- Update Launch Template (This creates a new template version)
- Delete Old Template but leave the last 2 (use EventBridge)
- Start instance refresh on ASG

For Envs Use Parameter Store

- On new instance launch (life cycle hook), load this envs to .bashrc
