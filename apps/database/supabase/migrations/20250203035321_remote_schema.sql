

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."executive_actions" (
    "id" integer NOT NULL,
    "guid" "text" NOT NULL,
    "title" "text" NOT NULL,
    "link" "text" NOT NULL,
    "pub_date" timestamp with time zone,
    "description_html" "text",
    "full_html" "text",
    "categories" "text"[],
    "inserted_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."executive_actions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."executive_actions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."executive_actions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."executive_actions_id_seq" OWNED BY "public"."executive_actions"."id";



CREATE TABLE IF NOT EXISTS "public"."executive_orders" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "citation" "text",
    "document_number" "text",
    "end_page" integer,
    "html_url" "text",
    "pdf_url" "text",
    "type" "text",
    "subtype" "text",
    "publication_date" "date",
    "signing_date" "date",
    "start_page" integer,
    "title" "text",
    "disposition_notes" "text",
    "executive_order_number" "text",
    "not_received_for_publication" "text",
    "full_text_xml_url" "text",
    "body_html_url" "text",
    "json_url" "text",
    "full_text_xml" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "full_text_markdown" "text",
    "presidency_project_title" "text",
    "presidency_project_date" "text",
    "presidency_project_url" "text",
    "presidency_project_html" "text"
);


ALTER TABLE "public"."executive_orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."job_status" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "job_name" "text" NOT NULL,
    "last_run_at" timestamp with time zone,
    "last_success_at" timestamp with time zone,
    "run_count" integer DEFAULT 0,
    "last_error" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."job_status" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."president_schedule" (
    "id" bigint NOT NULL,
    "date" "date" NOT NULL,
    "time" time with time zone,
    "time_formatted" "text",
    "year" integer NOT NULL,
    "month" "text" NOT NULL,
    "day" integer NOT NULL,
    "day_of_week" "text" NOT NULL,
    "type" "text" NOT NULL,
    "details" "text",
    "location" "text",
    "coverage" "text",
    "daily_text" "text",
    "url" "text",
    "video_url" "text",
    "day_summary" "jsonb",
    "newmonth" boolean,
    "daycount" integer,
    "lastdaily" boolean,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "latitude" double precision,
    "longitude" double precision
);


ALTER TABLE "public"."president_schedule" OWNER TO "postgres";


ALTER TABLE "public"."president_schedule" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."president_schedule_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."executive_actions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."executive_actions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."executive_actions"
    ADD CONSTRAINT "executive_actions_guid_key" UNIQUE ("guid");



ALTER TABLE ONLY "public"."executive_actions"
    ADD CONSTRAINT "executive_actions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."executive_orders"
    ADD CONSTRAINT "executive_orders_document_number_key" UNIQUE ("document_number");



ALTER TABLE ONLY "public"."executive_orders"
    ADD CONSTRAINT "executive_orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."job_status"
    ADD CONSTRAINT "job_status_job_name_key" UNIQUE ("job_name");



ALTER TABLE ONLY "public"."job_status"
    ADD CONSTRAINT "job_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."president_schedule"
    ADD CONSTRAINT "president_schedule_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."president_schedule"
    ADD CONSTRAINT "unique_event" UNIQUE ("date", "time", "details");



CREATE POLICY "Enable insert for authenticated users only" ON "public"."president_schedule" FOR INSERT TO "supabase_admin" WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."executive_actions" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."executive_orders" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."job_status" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."president_schedule" FOR SELECT USING (true);



ALTER TABLE "public"."executive_actions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."executive_orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."job_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."president_schedule" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";








GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




































































































































































































































GRANT ALL ON TABLE "public"."executive_actions" TO "anon";
GRANT ALL ON TABLE "public"."executive_actions" TO "authenticated";
GRANT ALL ON TABLE "public"."executive_actions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."executive_actions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."executive_actions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."executive_actions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."executive_orders" TO "anon";
GRANT ALL ON TABLE "public"."executive_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."executive_orders" TO "service_role";



GRANT ALL ON TABLE "public"."job_status" TO "anon";
GRANT ALL ON TABLE "public"."job_status" TO "authenticated";
GRANT ALL ON TABLE "public"."job_status" TO "service_role";



GRANT ALL ON TABLE "public"."president_schedule" TO "anon";
GRANT ALL ON TABLE "public"."president_schedule" TO "authenticated";
GRANT ALL ON TABLE "public"."president_schedule" TO "service_role";



GRANT ALL ON SEQUENCE "public"."president_schedule_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."president_schedule_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."president_schedule_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
