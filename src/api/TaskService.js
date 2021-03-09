export default class TaskService {
    static async getTasks() {
        console.log("Calling Get Tasks");
        const response = await fetch("http://localhost:8080/api/v1/task", {
            method: "GET",
            credentials: "include"
        });
        if (response.status !== 200) {
            throw new Error("API Error");
        }
        const tasks = await response.json();
        return tasks;
    }

    static async createTask(description) {
        console.log("Calling Create Tasks");
        const response = await fetch("http://localhost:8080/api/v1/task", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: description })
        });
        if (response.status !== 200) {
            throw new Error("API Error");
        }
        const newTask = await response.json();
        return newTask;

    }

    static async deleteTask(task) {
        console.log("Calling Delete Tasks");
        const response = await fetch(`http://localhost:8080/api/v1/task/${task._id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (response.status !== 200) {
            throw new Error("API Error");
        }
        return await response.json();
    }

    static async updateTask(task) {
        console.log("Calling Update Tasks");
        const response = await fetch(`http://localhost:8080/api/v1/task/${task._id}`, {
            method: "PUT",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: task })
        });
        if (response.status !== 200) {
            throw new Error("API Error");
        }
        return await response.json();
    }
}