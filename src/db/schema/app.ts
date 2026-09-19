import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()).notNull(),
}

export const departments = pgTable('departments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: varchar('code', {length: 50}).notNull().unique(),
  name: varchar('name', {length: 255}).notNull(),
  description: varchar('description', {length: 255}),
  ...timestamps
});

export const employees = pgTable('employees', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  departmentId: integer('department_id').notNull().references(() => departments.id, { onDelete: 'restrict' }),
  firstName: varchar('first_name', {length: 25}).notNull(),
  middleName: varchar('middle_name', {length: 25}),
  lastName: varchar('last_name', {length: 25}).notNull(),
  ...timestamps
});

export const departmentRelations = relations(departments, ({ many }) => ({
  employees: many(employees)
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.id],
  })
}));

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;

export type Employees = typeof employees.$inferSelect;
export type NewEmployees = typeof employees.$inferInsert;