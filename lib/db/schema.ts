import { pgTable, serial, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const inventoryTypeEnum = pgEnum('inventory_type', ['masuk', 'keluar'])

export const inventoryItems = pgTable('inventory_items', {
  id: serial('id').primaryKey(),
  date: timestamp('date', { withTimezone: true }).notNull(),
  name: text('name').notNull(),
  type: inventoryTypeEnum('type').notNull(),
  quantity: integer('quantity').notNull(),
  notes: text('notes'),
  project: text('project').notNull(),
  supervisor: text('supervisor').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type InventoryItem = typeof inventoryItems.$inferSelect
export type NewInventoryItem = typeof inventoryItems.$inferInsert