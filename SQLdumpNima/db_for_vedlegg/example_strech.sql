--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

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

--
-- Name: ltree; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS ltree WITH SCHEMA public;


--
-- Name: EXTENSION ltree; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION ltree IS 'data type for hierarchical tree-like structures';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: connection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.connection (
    object_1 integer NOT NULL,
    object_2 integer NOT NULL,
    "ID" integer NOT NULL
);


ALTER TABLE public.connection OWNER TO postgres;

--
-- Name: connections_2_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."connections_2_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."connections_2_ID_seq" OWNER TO postgres;

--
-- Name: connections_2_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."connections_2_ID_seq" OWNED BY public.connection."ID";


--
-- Name: object; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.object (
    "RD" public.ltree NOT NULL,
    "ID" integer NOT NULL,
    type text
);


ALTER TABLE public.object OWNER TO postgres;

--
-- Name: object_table_2_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."object_table_2_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."object_table_2_ID_seq" OWNER TO postgres;

--
-- Name: object_table_2_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."object_table_2_ID_seq" OWNED BY public.object."ID";


--
-- Name: type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type (
    value text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.type OWNER TO postgres;

--
-- Name: typeMenNy_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."typeMenNy_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."typeMenNy_id_seq" OWNER TO postgres;

--
-- Name: typeMenNy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."typeMenNy_id_seq" OWNED BY public.type.id;


--
-- Name: type_men_ny_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.type_men_ny_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.type_men_ny_id_seq OWNER TO postgres;

--
-- Name: type_men_ny_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.type_men_ny_id_seq OWNED BY public.type.id;


--
-- Name: connection ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connection ALTER COLUMN "ID" SET DEFAULT nextval('public."connections_2_ID_seq"'::regclass);


--
-- Name: object ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.object ALTER COLUMN "ID" SET DEFAULT nextval('public."object_table_2_ID_seq"'::regclass);


--
-- Name: type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type ALTER COLUMN id SET DEFAULT nextval('public."typeMenNy_id_seq"'::regclass);


--
-- Data for Name: connection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.connection (object_1, object_2, "ID") FROM stdin;
2	3	1
3	4	2
4	5	3
2	6	4
6	7	5
6	8	6
8	9	7
8	10	8
10	11	9
11	12	10
12	13	11
13	14	12
8	15	13
15	16	14
15	17	15
17	18	16
18	19	17
18	20	18
20	21	19
20	22	20
22	23	21
22	24	22
24	25	23
25	26	24
26	27	25
24	28	26
28	29	27
28	30	28
30	31	29
30	32	30
32	33	31
27	37	32
\.


--
-- Data for Name: object; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.object ("RD", "ID", type) FROM stdin;
BaneNOR.PS.ExampleStretch.J1.JE1.FCA1	3	\N
BaneNOR.PS.ExampleStretch.J1.JE1.TAA1	4	\N
BaneNOR.PS.ExampleStretch.J1.JE1.XBA1	5	\N
BaneNOR.PS.ExampleStretch.J1.KL1.JE1.FCA1	11	\N
BaneNOR.PS.ExampleStretch.J1.KL1.JE1.TAA1	13	\N
BaneNOR.PS.ExampleStretch.J1.KL1.JE1.XBA1	14	\N
BaneNOR.PS.ExampleStretch.J1.JE3.QBA1	25	QBA1
BaneNOR.PS.ExampleStretch.J1.JE3.FCA1	26	\N
BaneNOR.PS.ExampleStretch.J1.JE3.TAA1	27	\N
BaneNOR.PS.ExampleStretch.J1.KL3.KL1.UAA1	28	UAA1
BaneNOR.PS.ExampleStretch.J1.KL3.KL1.QBA1	29	QBA4
BaneNOR.PS.ExampleStretch.J1.KL3.KL2.UAA1	32	UAA1
BaneNOR.PS.ExampleStretch.J1.KL3.KL2.QBA1	33	QBA4
BaneNOR.PS.ExampleStretch.J1.KL1.KL1.UAA1	6	UAA1
BaneNOR.PS.ExampleStretch.J1.KL1.KL1.QBA1	7	QBA3
BaneNOR.PS.ExampleStretch.J1.KL1.JE1.QBA1	12	QBA3
BaneNOR.PS.ExampleStretch.J1.KL1.KL2.UAA1	15	UAA1
BaneNOR.PS.ExampleStretch.J1.KL1.KL2.QBA1	16	QBA1
BaneNOR.PS.ExampleStretch.J1.KL2.KL1.UAA1	18	UAA2
BaneNOR.PS.ExampleStretch.J1.KL2.KL1.QBA1	19	QBA2
BaneNOR.PS.ExampleStretch.J1.KL2.KL2.UAA1	22	UAA2
BaneNOR.PS.ExampleStretch.J1.KL2.KL2.QBA1	23	QBA2
BaneNOR.PS.ExampleStretch.J1.KL3	34	KL1
BaneNOR.PS.ExampleStretch.J1.KL2	35	KL2
BaneNOR.PS.ExampleStretch.J1.KL1	36	KL3
BaneNOR.PS.ExampleStretch.J1.JE3.XBA1	37	\N
BaneNOR.PS.ExampleStretch.J1.JE1.WBC1	2	WBC1
BaneNOR.PS.ExampleStretch.J1.KL1.JE1.WBC1	8	WBC1
BaneNOR.PS.ExampleStretch.J1.KL1.JE1.WBC2	9	WBC1
BaneNOR.PS.ExampleStretch.J1.KL1.JE1.WBC3	10	WBC1
BaneNOR.PS.ExampleStretch.J1.JE2.WBC1	17	WBC1
BaneNOR.PS.ExampleStretch.J1.KL2.JE1.WBC1	20	WBC1
BaneNOR.PS.ExampleStretch.J1.KL2.JE1.WBC2	21	WBC1
BaneNOR.PS.ExampleStretch.J1.JE3.WBC1	24	WBC1
BaneNOR.PS.ExampleStretch.J1.KL3.JE1.WBC1	30	WBC1
BaneNOR.PS.ExampleStretch.J1.KL3.JE1.WBC2	31	WBC1
\.


--
-- Data for Name: type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type (value, id) FROM stdin;
WBC1	1
WBC2	2
WBC3	3
WBC4	4
QBA1	5
QBA2	6
QBA3	7
QBA4	8
UAA1	9
UAA2	10
KL1	11
KL2	12
JE1	13
JE2	14
JE3	15
KL3	16
KL4	17
\.


--
-- Name: connections_2_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."connections_2_ID_seq"', 32, true);


--
-- Name: object_table_2_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."object_table_2_ID_seq"', 37, true);


--
-- Name: typeMenNy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."typeMenNy_id_seq"', 17, true);


--
-- Name: type_men_ny_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_men_ny_id_seq', 1, false);


--
-- Name: connection connections_2_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connection
    ADD CONSTRAINT connections_2_pkey PRIMARY KEY ("ID");


--
-- Name: object object_table_2_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.object
    ADD CONSTRAINT object_table_2_pkey PRIMARY KEY ("ID");


--
-- Name: type type_men_ny_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_men_ny_pkey PRIMARY KEY (id);


--
-- Name: type value_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT value_unique UNIQUE (value);


--
-- Name: connection connections_2_node1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connection
    ADD CONSTRAINT connections_2_node1_fkey FOREIGN KEY (object_1) REFERENCES public.object("ID") NOT VALID;


--
-- Name: connection connections_2_node2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connection
    ADD CONSTRAINT connections_2_node2_fkey FOREIGN KEY (object_2) REFERENCES public.object("ID") NOT VALID;


--
-- Name: object object_table_2_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.object
    ADD CONSTRAINT object_table_2_type_fkey FOREIGN KEY (type) REFERENCES public.type(value) NOT VALID;


--
-- PostgreSQL database dump complete
--

