FROM node:24.12.0-alpine
LABEL authors="glaty"
WORKDIR /event-planner
# copy application source code
COPY . .

# install dependencies
RUN npm install

# Inform Docker which port the container listens on at runtime
EXPOSE 5173

#  Default command to run when the container starts
CMD ["npm", "run", "dev"]