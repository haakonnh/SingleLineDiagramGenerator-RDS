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
-- Name: alternativ4; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alternativ4 (
    path public.ltree NOT NULL,
    id integer NOT NULL,
    type_value text
);


ALTER TABLE public.alternativ4 OWNER TO postgres;

--
-- Name: alternativ4_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alternativ4_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alternativ4_id_seq OWNER TO postgres;

--
-- Name: alternativ4_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alternativ4_id_seq OWNED BY public.alternativ4.id;


--
-- Name: connections4; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.connections4 (
    id integer NOT NULL,
    node1 integer,
    node2 integer
);


ALTER TABLE public.connections4 OWNER TO postgres;

--
-- Name: connections4_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.connections4_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.connections4_id_seq OWNER TO postgres;

--
-- Name: connections4_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.connections4_id_seq OWNED BY public.connections4.id;


--
-- Name: type_men_ny; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_men_ny (
    value text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.type_men_ny OWNER TO postgres;

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

ALTER SEQUENCE public."typeMenNy_id_seq" OWNED BY public.type_men_ny.id;


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

ALTER SEQUENCE public.type_men_ny_id_seq OWNED BY public.type_men_ny.id;


--
-- Name: alternativ4 id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alternativ4 ALTER COLUMN id SET DEFAULT nextval('public.alternativ4_id_seq'::regclass);


--
-- Name: connections4 id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections4 ALTER COLUMN id SET DEFAULT nextval('public.connections4_id_seq'::regclass);


--
-- Name: type_men_ny id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_men_ny ALTER COLUMN id SET DEFAULT nextval('public."typeMenNy_id_seq"'::regclass);


--
-- Data for Name: alternativ4; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alternativ4 (path, id, type_value) FROM stdin;
baneNorLundamoStavne.J1.KL5.JE1.WBC5	56	\N
baneNorLundamoStavne.J1.KL5.JE1.WBC6	57	\N
baneNorLundamoStavne.J1.KL5.JE1.QBA1	58	\N
baneNorLundamoStavne.J1.JE2.WBC1	3	WBC1
baneNorLundamoStavne.J1.KL2.KL1.QBA1	15	QBA4
baneNorLundamoStavne.J1.KL2.JE1.WBC1	16	WBC1
baneNorLundamoStavne.J1.KL2.JE1.WBC2	17	WBC3
baneNorLundamoStavne.J1.KL2.JE1.QBA1	18	QBA1
baneNorLundamoStavne.J1.KL2.KL2.UAA1	20	UAA1
baneNorLundamoStavne.J1.KL2.KL2.QBA1	21	QBA4
baneNorLundamoStavne.J1.JE4.WBC1	22	WBC1
baneNorLundamoStavne.J1.KL3.KL1.UAA1	23	UAA1
baneNorLundamoStavne.J1.KL3.KL2.QBA1	30	QBA4
baneNorLundamoStavne.J1.JE5.WBC1	31	WBC1
baneNorLundamoStavne.J1.KL4.KL1.UAA1	32	UAA1
baneNorLundamoStavne.J1.KL4.KL1.QBA1	33	QBA4
baneNorLundamoStavne.J1.KL5.JE1.XBA1	59	\N
baneNorLundamoStavne.J1.KL5.KL2.QBA1	61	\N
baneNorLundamoStavne.J1.KL5.WBC1	62	\N
baneNorLundamoStavne.J1.KL4.JE1.WBC1	34	WBC1
baneNorLundamoStavne.J1.KL4.JE1.WBC2	35	WBC3
baneNorLundamoStavne.J1.KL4.JE1.QBA1	36	QBA1
baneNorLundamoStavne.J1.KL4.KL2.UAA1	38	UAA1
baneNorLundamoStavne.J1.JE8.WBC2	64	\N
baneNorLundamoStavne.J1.KL4.KL2.QBA1	39	QBA4
baneNorLundamoStavne.J1.KL6.JE1.QBA1	69	\N
baneNorLundamoStavne.J1.JE6.WBC1	40	WBC1
baneNorLundamoStavne.J1.KL6.JE1.XBA1	70	\N
baneNorLundamoStavne	74	\N
baneNorLundamoStavne.J1.JE1.WBC1	1	\N
baneNorLundamoStavne.J1.JE1.QBA1	2	\N
baneNorLundamoStavne.J1.KL1.JE1.XBA1	9	\N
baneNorLundamoStavne.J1.KL2.JE1.XBA1	19	\N
baneNorLundamoStavne.J1.KL4.JE1.XBA1	37	\N
baneNorLundamoStavne.J1.JE6.WBC2	41	\N
baneNorLundamoStavne.J1.JE7.KL1.UAA1	42	\N
baneNorLundamoStavne.J1.JE7.KL1.QBA1	43	\N
baneNorLundamoStavne.J1.JE7.WBC1	44	\N
baneNorLundamoStavne.J1	75	\N
baneNorLundamoStavne.J1.JE1	76	\N
baneNorLundamoStavne.J1.JE2	77	\N
baneNorLundamoStavne.J1JE3	79	\N
baneNorLundamoStavne.J1.JE4	81	\N
baneNorLundamoStavne.J1.JE5	83	\N
baneNorLundamoStavne.J1.JE6	85	\N
baneNorLundamoStavne.J1.KL6.KL1	107	\N
baneNorLundamoStavne.J1.JE3.WBC1	12	WBC1
baneNorLundamoStavne.J1.KL6.KL2	108	\N
baneNorLundamoStavne.J1.KL2.KL1.UAA1	14	UAA1
baneNorLundamoStavne.J1.KL1.KL1.UAA1	4	UAA1
baneNorLundamoStavne.J1.KL3.KL1.QBA1	24	QBA1
baneNorLundamoStavne.J1.KL3.JE1.WBC1	25	WBC1
baneNorLundamoStavne.J1.KL3.JE1.WBC2	26	WBC3
baneNorLundamoStavne.J1.KL1.KL1.QBA1	5	QBA4
baneNorLundamoStavne.J1.KL3.JE1.QBA1	27	QBA1
baneNorLundamoStavne.J1.KL3.KL2.UAA1	29	UAA1
baneNorLundamoStavne.J1.KL1.JE1.WBC1	6	WBC1
baneNorLundamoStavne.J1.KL5.KL1.UAA1	50	UAA1
baneNorLundamoStavne.J1.KL5.JE1.WBC1	52	WBC3
baneNorLundamoStavne.J1.KL1.JE1.WBC2	7	WBC3
baneNorLundamoStavne.J1.KL5.JE1.WBC2	53	WBC1
baneNorLundamoStavne.J1.KL5.JE1.WBC3	54	WBC3
baneNorLundamoStavne.J1.KL1.JE1.QBA1	8	QBA1
baneNorLundamoStavne.J1.KL5.JE1.WBC4	55	WBC2
baneNorLundamoStavne.J1.KL5.KL2.UAA1	60	UAA1
baneNorLundamoStavne.J1.JE8.WBC1	63	WBC1
baneNorLundamoStavne.J1.KL1.KL2.UAA1	10	UAA1
baneNorLundamoStavne.J1.KL6.KL1.UAA1	65	UAA1
baneNorLundamoStavne.J1.KL6.KL1.QBA1	66	QBA1
baneNorLundamoStavne.J1.KL1.KL2.QBA1	11	QBA4
baneNorLundamoStavne.J1.JE3.XBA1	13	\N
baneNorLundamoStavne.J1.KL3.JE1.XBA1	28	\N
baneNorLundamoStavne.J1.JE7.WBC2	45	\N
baneNorLundamoStavne.J1.JE7.WBC3	46	\N
baneNorLundamoStavne.J1.JE7.WBC4	47	\N
baneNorLundamoStavne.J1.JE7.WBC5	48	\N
baneNorLundamoStavne.J1.JE7.WBC6	49	\N
baneNorLundamoStavne.J1.KL5.KL1.QBA1	51	\N
baneNorLundamoStavne.J1.JE7	86	\N
baneNorLundamoStavne.J1.JE8	88	\N
baneNorLundamoStavne.J1.JE9	90	\N
baneNorLundamoStavne.J1.KL1.KL1	91	\N
baneNorLundamoStavne.J1.KL1.KL2	92	\N
baneNorLundamoStavne.J1.KL2.KL1	94	\N
baneNorLundamoStavne.J1.KL2.KL2	95	\N
baneNorLundamoStavne.J1.KL3.KL1	97	\N
baneNorLundamoStavne.J1.KL3.KL2	98	\N
baneNorLundamoStavne.J1.KL4.KL1	100	\N
baneNorLundamoStavne.J1.KL4.KL2	101	\N
baneNorLundamoStavne.J1.JE7.KL1	103	\N
baneNorLundamoStavne.J1.KL5.KL1	104	\N
baneNorLundamoStavne.J1.KL5.KL2	105	\N
baneNorLundamoStavne.J1.KL6.JE1.WBC1	67	WBC1
baneNorLundamoStavne.J1.KL6.JE1.WBC2	68	WBC3
baneNorLundamoStavne.J1.KL6.KL2.UAA1	71	UAA1
baneNorLundamoStavne.J1.KL6.KL2.QBA1	72	QBA2
baneNorLundamoStavne.J1.JE9.WBC1	73	WBC1
baneNorLundamoStavne.J1.KL1.JE1	93	JE2
baneNorLundamoStavne.J1.KL2.JE1	96	JE2
baneNorLundamoStavne.J1.KL3.JE1	99	JE2
baneNorLundamoStavne.J1.KL4.JE1	102	JE2
baneNorLundamoStavne.J1.KL5.JE1	106	JE3
baneNorLundamoStavne.J1.KL6.JE1	109	JE2
baneNorLundamoStavne.J1.KL1	78	KL2
baneNorLundamoStavne.J1.KL2	80	KL2
baneNorLundamoStavne.J1.KL3	82	KL2
baneNorLundamoStavne.J1.KL4	84	KL2
baneNorLundamoStavne.J1.KL5	87	KL3
baneNorLundamoStavne.J1.KL6	89	KL2
\.


--
-- Data for Name: connections4; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.connections4 (id, node1, node2) FROM stdin;
1	3	2
2	2	1
3	3	4
4	4	5
5	4	6
6	6	7
7	6	8
8	8	9
9	6	10
10	10	11
11	10	12
12	12	13
13	12	14
14	14	15
15	14	16
16	16	17
17	17	18
18	18	19
19	16	20
20	20	21
21	20	22
22	22	23
23	23	24
24	23	25
25	25	26
26	26	27
27	27	28
28	25	29
29	29	30
31	31	32
32	32	33
33	32	34
34	34	35
36	34	37
37	34	38
38	38	39
39	38	40
40	40	50
41	50	53
42	53	52
43	53	54
44	52	58
45	52	59
46	54	55
47	53	60
48	60	63
49	63	65
50	65	66
51	65	67
52	67	68
53	68	69
54	69	70
55	67	71
56	71	72
57	71	73
30	29	31
\.


--
-- Data for Name: type_men_ny; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type_men_ny (value, id) FROM stdin;
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
-- Name: alternativ4_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alternativ4_id_seq', 109, true);


--
-- Name: connections4_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.connections4_id_seq', 57, true);


--
-- Name: typeMenNy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."typeMenNy_id_seq"', 17, true);


--
-- Name: type_men_ny_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_men_ny_id_seq', 1, false);


--
-- Name: alternativ4 alternativ4_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alternativ4
    ADD CONSTRAINT alternativ4_pkey PRIMARY KEY (id);


--
-- Name: connections4 connections4_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections4
    ADD CONSTRAINT connections4_pkey PRIMARY KEY (id);


--
-- Name: type_men_ny type_men_ny_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_men_ny
    ADD CONSTRAINT type_men_ny_pkey PRIMARY KEY (id);


--
-- Name: type_men_ny value_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_men_ny
    ADD CONSTRAINT value_unique UNIQUE (value);


--
-- Name: connections4 node1_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections4
    ADD CONSTRAINT node1_fk FOREIGN KEY (node1) REFERENCES public.alternativ4(id) NOT VALID;


--
-- Name: connections4 node2_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections4
    ADD CONSTRAINT node2_fk FOREIGN KEY (node2) REFERENCES public.alternativ4(id) NOT VALID;


--
-- Name: alternativ4 type_value; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alternativ4
    ADD CONSTRAINT type_value FOREIGN KEY (type_value) REFERENCES public.type_men_ny(value) NOT VALID;


--
-- PostgreSQL database dump complete
--

