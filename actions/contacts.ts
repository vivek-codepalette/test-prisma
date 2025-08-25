'use server'

import prisma from '@/lib/prisma'

export async function getContacts() {
    const contacts = await prisma.contact.findMany()
    return contacts
}