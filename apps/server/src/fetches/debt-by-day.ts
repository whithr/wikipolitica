import { createClient } from "@supabase/supabase-js";
import schedule from "node-schedule";
import "dotenv/config.js";
import { updateJobStatus } from "../lib/status.utils";

// ==========================================
// 1) ENV variables for Supabase 
// ==========================================
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ==========================================
// 2) Types
// ==========================================
interface DebtByDay {
    record_date: string;
    debt_held_public_amt: number;
    intragov_hold_amt: number;
    tot_pub_debt_out_amt: number;
}

interface DebtRawData {
    data: DebtDataItem[];
    meta: {
        count: number;
        labels: {
            record_date: string;
            debt_held_public_amt: string;
            intragov_hold_amt: string;
            tot_pub_debt_out_amt: string;
            src_line_nbr: string;
            record_fiscal_year: string;
            record_fiscal_quarter: string;
            record_calendar_year: string;
            record_calendar_quarter: string;
            record_calendar_month: string;
            record_calendar_day: string;
        };
        dataTypes: {
            record_date: string;
            debt_held_public_amt: string;
            intragov_hold_amt: string;
            tot_pub_debt_out_amt: string;
            src_line_nbr: string;
            record_fiscal_year: string;
            record_fiscal_quarter: string;
            record_calendar_year: string;
            record_calendar_quarter: string;
            record_calendar_month: string;
            record_calendar_day: string;
        };
        dataFormats: {
            record_date: string;
            debt_held_public_amt: string;
            intragov_hold_amt: string;
            tot_pub_debt_out_amt: string;
            src_line_nbr: string;
            record_fiscal_year: string;
            record_fiscal_quarter: string;
            record_calendar_year: string;
            record_calendar_quarter: string;
            record_calendar_month: string;
            record_calendar_day: string;
        };
        "total-count": number;
        "total-pages": number;
    };
    links: {
        self: string;
        first: string;
        prev: string | null;
        next: string | null;
        last: string;
    };
}

interface DebtDataItem {
    record_date: string;
    debt_held_public_amt: string;
    intragov_hold_amt: string;
    tot_pub_debt_out_amt: string;
    src_line_nbr: string;
    record_fiscal_year: string;
    record_fiscal_quarter: string;
    record_calendar_year: string;
    record_calendar_quarter: string;
    record_calendar_month: string;
    record_calendar_day: string;
}

// ==========================================
// 3) Get last date from supabase
// ==========================================
async function getLastDateFromSupabase(): Promise<string> {
    const { data, error } = await supabase
        .from("debt_by_day")
        .select("record_date")
        .order("record_date", { ascending: false })
        .limit(1)
        .single();
    if (error) {
        console.error("Error getting last date from supabase:", error);
    }
    return data?.record_date || null;
}

// ==========================================
// 4) Fetch debt data from API older than last date
// ==========================================
async function fetchDebtData(lastDate: string): Promise<DebtRawData> {
    const response = await fetch(
        `https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?filter=record_date:gt:${lastDate}`,
    );
    return response.json();
}

// ==========================================
// 5) Extract debt data from API response
// ==========================================
function extractDebtData(rawData: DebtRawData): DebtByDay[] {
    return rawData.data.map((item) => ({
        record_date: item.record_date,
        debt_held_public_amt: parseFloat(item.debt_held_public_amt),
        intragov_hold_amt: parseFloat(item.intragov_hold_amt),
        tot_pub_debt_out_amt: parseFloat(item.tot_pub_debt_out_amt),
    }));
}

// ==========================================
// 6) Insert (NOT upsert) cleaned data into Supabase
// ==========================================
async function insertDebtData(debtData: DebtByDay[]): Promise<void> {
    const { error } = await supabase
        .from("debt_by_day")
        .insert(debtData);
    if (error) {
        console.error("Error inserting debt data:", error);
    }
}

// ==========================================
// 7) Schedule job: every day at 12:00am
// ==========================================

schedule.scheduleJob("0 0 * * *", async () => {
    const jobName = "debt_by_day_fetcher";
    try {
        console.log(
            "[Scheduled Task] Fetching debt data...",
        );
        const lastDate = await getLastDateFromSupabase();
        const debtData = await fetchDebtData(lastDate);
        const cleanedData = extractDebtData(debtData);
        await insertDebtData(cleanedData);
        console.log("[Scheduled Task] Done.");
    } catch (err) {
        console.error(`[Scheduled Task] ${jobName} error:`, err);
        await updateJobStatus(jobName, {
            errorMsg: "error fetching debt data",
        }, supabase);
    }

});

// ==========================================
// Run once on startup for testing
// ==========================================
// async () => {
//     const jobName = "debt_by_day_fetcher";
//     try {
//         console.log(
//             "[Scheduled Task] Fetching debt data...",
//         );
//         const lastDate = await getLastDateFromSupabase();
//         const debtData = await fetchDebtData(lastDate);
//         const cleanedData = extractDebtData(debtData);
//         await insertDebtData(cleanedData);
//         console.log("[Scheduled Task] Done.");
//     } catch (err) {
//         console.error(`[Scheduled Task] ${jobName} error:`, err);
//         await updateJobStatus(jobName, {
//             errorMsg: "error fetching debt data",
//         }, supabase);
//     }

// }

