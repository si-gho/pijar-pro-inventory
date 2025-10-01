import { pgTable, serial, text, integer, timestamp, pgEnum, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ENUM untuk jenis transaksi
export const trxTypeEnum = pgEnum('trx_type_enum', ['masuk', 'keluar'])

// Tabel users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  fullName: varchar('full_name', { length: 150 }).notNull(),
  role: varchar('role', { length: 50 }).default('operator'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Tabel inventory
export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  itemName: varchar('item_name', { length: 150 }).notNull(),
  description: text('description'),
  stockQty: integer('stock_qty').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

// Tabel transactions
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  inventoryId: integer('inventory_id').notNull().references(() => inventory.id, { onDelete: 'cascade' }),
  trxType: trxTypeEnum('trx_type').notNull(),
  qty: integer('qty').notNull(),
  trxDate: timestamp('trx_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Tabel transaction_media
export const transactionMedia = pgTable('transaction_media', {
  id: serial('id').primaryKey(),
  transactionId: integer('transaction_id').notNull().references(() => transactions.id, { onDelete: 'cascade' }),
  fileUrl: text('file_url').notNull(),
  fileType: varchar('file_type', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
}))

export const inventoryRelations = relations(inventory, ({ many }) => ({
  transactions: many(transactions),
}))

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  inventory: one(inventory, {
    fields: [transactions.inventoryId],
    references: [inventory.id],
  }),
  media: many(transactionMedia),
}))

export const transactionMediaRelations = relations(transactionMedia, ({ one }) => ({
  transaction: one(transactions, {
    fields: [transactionMedia.transactionId],
    references: [transactions.id],
  }),
}))

// Types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Inventory = typeof inventory.$inferSelect
export type NewInventory = typeof inventory.$inferInsert

export type Transaction = typeof transactions.$inferSelect
export type NewTransaction = typeof transactions.$inferInsert

export type TransactionMedia = typeof transactionMedia.$inferSelect
export type NewTransactionMedia = typeof transactionMedia.$inferInsert

// Legacy types for backward compatibility
export type InventoryItem = Transaction & {
  user: User
  inventory: Inventory
  media?: TransactionMedia[]
}
export type NewInventoryItem = NewTransaction