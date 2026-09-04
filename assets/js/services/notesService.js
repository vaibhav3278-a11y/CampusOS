// ======================================
// CampusOS
// Notes Service v2.0
// ======================================

const NotesService = {

    storageKey: "notes",

    getAll() {
        return Storage.get(this.storageKey);
    },

    saveAll(notes) {
        Storage.save(this.storageKey, notes);
    },

    add(note) {

        const notes = this.getAll();

        notes.push(note);

        this.saveAll(notes);

    },

    getById(id) {

        return this.getAll().find(
            note => note.id === id
        );

    },
    duplicate(id) {

    const note = this.getById(id);

    return JSON.parse(JSON.stringify(note));

},

    update(updatedNote) {

        const notes = this.getAll().map(note =>

            note.id === updatedNote.id
                ? updatedNote
                : note

        );

        this.saveAll(notes);

    },

    delete(id) {

        const notes = this.getAll().filter(
            note => note.id !== id
        );

        this.saveAll(notes);

    },

    togglePin(id) {

        const notes = this.getAll();

        notes.forEach(note => {

            if (note.id === id) {

                note.pinned = !note.pinned;

            }

        });

        this.saveAll(notes);

    },

    getStatistics() {

        const notes = this.getAll();

        return {

            total: notes.length,

            pinned: notes.filter(
                note => note.pinned
            ).length,

            categories: new Set(
                notes.map(note => note.category)
            ).size

        };

    }

};