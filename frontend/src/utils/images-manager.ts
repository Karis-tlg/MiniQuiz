import { openDB } from "idb"
export class ImagesManager {
    static images_data: any

    static async getFileID(file: File): Promise<string> {
        const buffer = await file.arrayBuffer()
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        return hashHex + "_" + file.size
    }

    static async saveImage(file: File): Promise<string> {
        const db = await openDB("miniquiz-db", 1, {
            upgrade: (db) => db.createObjectStore("images"),
        })

        const fileID = await this.getFileID(file)

        const tx = db.transaction("images", "readwrite")
        const store = tx.objectStore("images")

        const existing = await store.get(fileID)

        if (existing) {
            existing.refcount++
            await store.put(existing, fileID)
        } else {
            await store.put({ file, refcount: 1 }, fileID)
        }

        await tx.done
        return fileID
    }

    static async getAllImages(): Promise<{ fileID: string, file: File }[]> {
        const db = await openDB("miniquiz-db", 1, {
            upgrade: (db) => db.createObjectStore("images"),
        })

        const tx = db.transaction("images", "readonly")
        const store = tx.objectStore("images")

        const images = await store.getAll()
        const keys = await store.getAllKeys()
        return images.map((record, idx) => ({ fileID: keys[idx] as string, file: record.file as File }))
    }

    static async getImage(fileID: string): Promise<{ file: File, refcount: number } | string | null> {
        if (this.images_data.hasOwnProperty(fileID)) return this.images_data[fileID]

        const db = await openDB("miniquiz-db", 1, {
            upgrade: (db) => db.createObjectStore("images"),
        })

        const tx = db.transaction("images", "readonly")
        const store = tx.objectStore("images")

        return await store.get(fileID)
    }

    static async deleteImage(fileID: string): Promise<void> {
        const db = await openDB("miniquiz-db", 1, {
            upgrade: (db) => db.createObjectStore("images"),
        })

        const tx = db.transaction("images", "readwrite")
        const store = tx.objectStore("images")

        const existing = await store.get(fileID)

        if (existing) {
            if (existing.refcount > 1) {
                existing.refcount--
                await store.put(existing, fileID)
            } else {
                await store.delete(fileID)
            }
        }
    }

    static async clearImages() {
        const db = await openDB("miniquiz-db", 1, {
            upgrade: (db) => db.createObjectStore("images"),
        })

        const tx = db.transaction("images", "readwrite")
        const store = tx.objectStore("images")

        await store.clear()
    }
}
