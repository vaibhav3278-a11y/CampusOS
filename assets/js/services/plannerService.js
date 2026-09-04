// ======================================
// CampusOS
// Planner Service v1.0
// ======================================

const PlannerService = {

    storageKey: "planner",

    getAll() {

        return Storage.get(this.storageKey);

    },

    saveAll(tasks) {

        Storage.save(this.storageKey, tasks);

    },

    add(task) {

        const tasks = this.getAll();

        tasks.push(task);

        this.saveAll(tasks);

    },

    getById(id) {

        return this.getAll().find(task => task.id === id);

    },

    update(updatedTask) {

        const tasks = this.getAll().map(task =>

            task.id === updatedTask.id
                ? updatedTask
                : task

        );

        this.saveAll(tasks);

    },

    delete(id) {

        const tasks = this.getAll().filter(

            task => task.id !== id

        );

        this.saveAll(tasks);

    },

    toggleComplete(id) {

        const tasks = this.getAll();

        tasks.forEach(task => {

            if (task.id === id) {

                task.completed = !task.completed;

            }

        });

        this.saveAll(tasks);

    },

    getStatistics() {

        const tasks = this.getAll();

        return {

            total: tasks.length,

            completed: tasks.filter(task => task.completed).length,

            pending: tasks.filter(task => !task.completed).length,

            high: tasks.filter(task => task.priority === "High").length

        };

    }

};