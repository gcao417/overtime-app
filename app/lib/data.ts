import { sql } from "@vercel/postgres";
import {
  UserField,
  CustomersTableType,
  OvertimeForm,
  LatestInvoiceRaw,
  Revenue,
  OvertimeTable,
} from "./definitions";
import { formatCurrency } from "./utils";

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log("Fetching revenue data...");
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log("Data fetch completed after 3 seconds.");

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchMyCardData(userID: string) {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const overtimeCountPromise = sql`SELECT COUNT(*) FROM overtime JOIN users ON overtime.user_id = users.id WHERE user_id=${userID}`;
    const pendingOvertimeCountPromise = sql`SELECT COUNT(*) FROM overtime JOIN users ON overtime.user_id = users.id WHERE status='pending' AND user_id=${userID}`;
    const confirmedOvertimeCountPromise = sql`SELECT COUNT(*) FROM overtime JOIN users ON overtime.user_id = users.id WHERE status='confirmed' AND user_id=${userID}`;
    const declinedOvertimeCountPromise = sql`SELECT COUNT(*) FROM overtime JOIN users ON overtime.user_id = users.id WHERE status='declined' AND user_id=${userID}`;

    const data = await Promise.all([
      overtimeCountPromise,
      pendingOvertimeCountPromise,
      confirmedOvertimeCountPromise,
      declinedOvertimeCountPromise,
    ]);

    const numberOfOvertimes = Number(data[0].rows[0].count ?? "0");
    const numberOfPendingOvertimes = Number(data[1].rows[0].count ?? "0");
    const numberOfConfirmedOvertimes = Number(data[2].rows[0].count ?? "0");
    const numberOfDeclinedOvertimes = Number(data[3].rows[0].count ?? "0");

    return {
      numberOfOvertimes,
      numberOfPendingOvertimes,
      numberOfConfirmedOvertimes,
      numberOfDeclinedOvertimes,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch my card data.");
  }
}

export async function fetchMonthlyCardData() {
  try {
    const overtimeCountPromise = sql`SELECT COUNT(*) FROM overtime JOIN users ON overtime.user_id = users.id WHERE start_time >= NOW() - INTERVAL '1 month'`;
    const pendingOvertimeCountPromise = sql`SELECT COUNT(*) FROM overtime JOIN users ON overtime.user_id = users.id WHERE status='pending' AND start_time >= NOW() - INTERVAL '1 month'`;
    const confirmedOvertimeCountPromise = sql`SELECT COUNT(*) FROM overtime JOIN users ON overtime.user_id = users.id WHERE status='confirmed' AND start_time >= NOW() - INTERVAL '1 month'`;
    const declinedOvertimeCountPromise = sql`SELECT COUNT(*) FROM overtime JOIN users ON overtime.user_id = users.id WHERE status='declined' AND start_time >= NOW() - INTERVAL '1 month'`;

    const data = await Promise.all([
      overtimeCountPromise,
      pendingOvertimeCountPromise,
      confirmedOvertimeCountPromise,
      declinedOvertimeCountPromise,
    ]);

    const numberOfOvertimes = Number(data[0].rows[0].count ?? "0");
    const numberOfPendingOvertimes = Number(data[1].rows[0].count ?? "0");
    const numberOfConfirmedOvertimes = Number(data[2].rows[0].count ?? "0");
    const numberOfDeclinedOvertimes = Number(data[3].rows[0].count ?? "0");

    return {
      numberOfOvertimes,
      numberOfPendingOvertimes,
      numberOfConfirmedOvertimes,
      numberOfDeclinedOvertimes,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch monthly card data.");
  }
}

export async function fetchYearlyCardData() {
  try {
    const overtimeCountPromise = sql`SELECT COUNT(*) FROM overtime JOIN users ON overtime.user_id = users.id WHERE start_time >= NOW() - INTERVAL '1 year'`;
    const pendingOvertimeCountPromise = sql`SELECT COUNT(*) FROM overtime JOIN users ON overtime.user_id = users.id WHERE status='pending' AND start_time >= NOW() - INTERVAL '1 year'`;
    const confirmedOvertimeCountPromise = sql`SELECT COUNT(*) FROM overtime JOIN users ON overtime.user_id = users.id WHERE status='confirmed' AND start_time >= NOW() - INTERVAL '1 year'`;
    const declinedOvertimeCountPromise = sql`SELECT COUNT(*) FROM overtime JOIN users ON overtime.user_id = users.id WHERE status='declined' AND start_time >= NOW() - INTERVAL '1 year'`;

    const data = await Promise.all([
      overtimeCountPromise,
      pendingOvertimeCountPromise,
      confirmedOvertimeCountPromise,
      declinedOvertimeCountPromise,
    ]);

    const numberOfOvertimes = Number(data[0].rows[0].count ?? "0");
    const numberOfPendingOvertimes = Number(data[1].rows[0].count ?? "0");
    const numberOfConfirmedOvertimes = Number(data[2].rows[0].count ?? "0");
    const numberOfDeclinedOvertimes = Number(data[3].rows[0].count ?? "0");

    return {
      numberOfOvertimes,
      numberOfPendingOvertimes,
      numberOfConfirmedOvertimes,
      numberOfDeclinedOvertimes,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch yearly card data.");
  }
}

export async function fetchAllData() {
  try {
    const data = await sql`
        SELECT
          users.name as username,
          users.department,
          overtime.creation_timestamp,
          overtime.type,
          overtime.status,
          overtime.start_time,
          overtime.end_time,
          approver_users.name AS approver_username
        FROM overtime
        JOIN users ON overtime.user_id = users.id
        LEFT JOIN users AS approver_users ON overtime.approver_id = approver_users.id
    `;

    const overtime = data.rows.map((overtime) => ({
      ...overtime,
    }));

    return overtime;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch overtime databse.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredOvertimes(
  query: string,
  currentPage: number,
  userID: string,
  status: string
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const overtimes =
      userID === "AllUserTimes"
        ? status
          ? await sql<OvertimeTable>`
        SELECT
          overtime.id,
          overtime.user_id,
          users.name as username,
          users.department,
          overtime.creation_timestamp,
          overtime.start_time,
          overtime.end_time,
          overtime.status,
          overtime.approver_id,
          approver_users.name AS approver_username,
          overtime.type
        FROM overtime
        JOIN users ON overtime.user_id = users.id
        LEFT JOIN users AS approver_users ON overtime.approver_id = approver_users.id
        WHERE overtime.status = ${status}
        ORDER BY overtime.creation_timestamp DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `
          : await sql<OvertimeTable>`
        SELECT
          overtime.id,
          overtime.user_id,
          users.name as username,
          users.department,
          overtime.creation_timestamp,
          overtime.start_time,
          overtime.end_time,
          overtime.status,
          overtime.approver_id,
          approver_users.name AS approver_username,
          overtime.type
        FROM overtime
        JOIN users ON overtime.user_id = users.id
        LEFT JOIN users AS approver_users ON overtime.approver_id = approver_users.id
        ORDER BY overtime.creation_timestamp DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `
        : status
        ? await sql<OvertimeTable>`
        SELECT
          overtime.id,
          overtime.user_id,
          users.name as username,
          users.department,
          overtime.creation_timestamp,
          overtime.start_time,
          overtime.end_time,
          overtime.status,
          overtime.approver_id,
          approver_users.name AS approver_username,
          overtime.type
        FROM overtime
        JOIN users ON overtime.user_id = users.id
        LEFT JOIN users AS approver_users ON overtime.approver_id = approver_users.id
        WHERE overtime.user_id = ${userID}
        AND overtime.status = ${status}
        ORDER BY overtime.creation_timestamp DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `
        : await sql<OvertimeTable>`
        SELECT
          overtime.id,
          overtime.user_id,
          users.name as username,
          users.department,
          overtime.creation_timestamp,
          overtime.start_time,
          overtime.end_time,
          overtime.status,
          overtime.approver_id,
          approver_users.name AS approver_username,
          overtime.type
        FROM overtime
        JOIN users ON overtime.user_id = users.id
        LEFT JOIN users AS approver_users ON overtime.approver_id = approver_users.id
        WHERE overtime.user_id = ${userID}
        ORDER BY overtime.creation_timestamp DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;

    return overtimes.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch overtimes.");
  }
}

export async function fetchOvertimePages(
  query: string,
  userID: string,
  status: string
) {
  try {
    const count =
      userID === "AllUserTimes"
        ? status
          ? await sql`SELECT COUNT(*)
        FROM overtime
        JOIN users ON overtime.user_id = users.id
        WHERE overtime.status = ${status}
        `
          : await sql`SELECT COUNT(*)
          FROM overtime
          JOIN users ON overtime.user_id = users.id
          `
        : status
        ? await sql`SELECT COUNT(*)
        FROM overtime
        JOIN users ON overtime.user_id = users.id
        WHERE overtime.user_id = ${userID}
        AND overtime.status = ${status}
        `
        : await sql`SELECT COUNT(*)
          FROM overtime
          JOIN users ON overtime.user_id = users.id
          WHERE overtime.user_id = ${userID}
          `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of overtimes.");
  }
}

export async function fetchOvertimeById(id: string) {
  try {
    const data = await sql<OvertimeForm>`
      SELECT
        overtime.id,
        overtime.user_id,
        overtime.creation_timestamp,
        overtime.start_time,
        overtime.end_time,
        overtime.status,
        overtime.approver_id,
        overtime.type
      FROM overtime
      WHERE overtime.id = ${id};
    `;

    const overtime = data.rows.map((overtime) => ({
      ...overtime,
    }));

    return overtime[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch overtime by ID.");
  }
}

export async function fetchUsers() {
  try {
    const data = await sql<UserField>`
      SELECT *
      FROM users
      ORDER BY name ASC
    `;

    const users = data.rows;
    return users;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all users.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}

export async function fetchDepartments() {
  try {
    const data = await sql<UserField>`
      SELECT *
      FROM departments
      ORDER BY name ASC
    `;

    return data.rows;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all departments.");
  }
}
