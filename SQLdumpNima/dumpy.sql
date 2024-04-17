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
    type integer
);


ALTER TABLE public.alternativ4 OWNER TO postgres;

--
-- Name: alternativ4_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.alternativ4 ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.alternativ4_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: alternativ4_type_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alternativ4_type_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alternativ4_type_seq OWNER TO postgres;

--
-- Name: alternativ4_type_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alternativ4_type_seq OWNED BY public.alternativ4.type;


--
-- Name: connections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.connections (
    connection_id integer NOT NULL,
    node1_id integer,
    node2_id integer
);


ALTER TABLE public.connections OWNER TO postgres;

--
-- Name: connections_connection_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.connections_connection_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.connections_connection_id_seq OWNER TO postgres;

--
-- Name: connections_connection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.connections_connection_id_seq OWNED BY public.connections.connection_id;


--
-- Name: connections3; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.connections3 (
    node_1 integer,
    node_2 integer,
    id integer DEFAULT nextval('public.connections_connection_id_seq'::regclass) NOT NULL,
    point_realative character varying
);


ALTER TABLE public.connections3 OWNER TO postgres;

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

ALTER TABLE public.connections4 ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.connections4_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: mitttre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mitttre (
    id integer NOT NULL,
    path public.ltree
);


ALTER TABLE public.mitttre OWNER TO postgres;

--
-- Name: secondTry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."secondTry" (
);


ALTER TABLE public."secondTry" OWNER TO postgres;

--
-- Name: tree; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tree (
    id integer NOT NULL,
    path1 public.ltree
);


ALTER TABLE public.tree OWNER TO postgres;

--
-- Name: tree3; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tree3 (
    id integer NOT NULL,
    path public.ltree
);


ALTER TABLE public.tree3 OWNER TO postgres;

--
-- Name: treeA3_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tree3 ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."treeA3_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tree_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tree_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tree_id_seq OWNER TO postgres;

--
-- Name: tree_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tree_id_seq OWNED BY public.tree.id;


--
-- Name: treny; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.treny (
    path public.ltree,
    id integer NOT NULL
);


ALTER TABLE public.treny OWNER TO postgres;

--
-- Name: type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type (
    id integer NOT NULL,
    type character varying
);


ALTER TABLE public.type OWNER TO postgres;

--
-- Name: type4; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type4 (
    id integer NOT NULL,
    type character varying
);


ALTER TABLE public.type4 OWNER TO postgres;

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
-- Name: alternativ4 type; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alternativ4 ALTER COLUMN type SET DEFAULT nextval('public.alternativ4_type_seq'::regclass);


--
-- Name: connections connection_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections ALTER COLUMN connection_id SET DEFAULT nextval('public.connections_connection_id_seq'::regclass);


--
-- Name: tree id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tree ALTER COLUMN id SET DEFAULT nextval('public.tree_id_seq'::regclass);


--
-- Name: type_men_ny id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_men_ny ALTER COLUMN id SET DEFAULT nextval('public."typeMenNy_id_seq"'::regclass);


--
-- Data for Name: alternativ4; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alternativ4 (path, id, type) FROM stdin;
baneNorLundamoStavne.J1.KL2.KL1.QBA1	15	8
baneNorLundamoStavne.J1.JE2.WBC1	3	1
baneNorLundamoStavne.J1.KL2.JE1.WBC1	16	1
baneNorLundamoStavne.J1.KL2.JE1.WBC2	17	3
baneNorLundamoStavne.J1.KL2.JE1.QBA1	18	5
baneNorLundamoStavne.J1.KL5.JE1.WBC5	56	\N
baneNorLundamoStavne.J1.KL2.KL2.UAA1	20	9
baneNorLundamoStavne.J1.KL2.KL2.QBA1	21	8
baneNorLundamoStavne.J1.JE4.WBC1	22	1
baneNorLundamoStavne.J1.KL3.KL1.UAA1	23	9
baneNorLundamoStavne.J1.KL3.KL2.QBA1	30	8
baneNorLundamoStavne.J1.JE5.WBC1	31	1
baneNorLundamoStavne.J1.KL4.KL1.UAA1	32	9
baneNorLundamoStavne.J1.KL4.KL1.QBA1	33	8
baneNorLundamoStavne.J1.KL4.JE1.WBC1	34	1
baneNorLundamoStavne.J1.KL4.JE1.WBC2	35	3
baneNorLundamoStavne.J1.KL5.JE1.WBC6	57	\N
baneNorLundamoStavne.J1.KL5.JE1.QBA1	58	\N
baneNorLundamoStavne.J1.KL4.KL2.UAA1	38	9
baneNorLundamoStavne.J1.KL4.KL2.QBA1	39	8
baneNorLundamoStavne.J1.JE6.WBC1	40	1
baneNorLundamoStavne.J1.KL5.JE1.WBC2	53	1
baneNorLundamoStavne.J1.KL5.JE1.WBC3	54	3
baneNorLundamoStavne.J1.KL5.JE1.WBC4	55	2
baneNorLundamoStavne.J1.KL5.KL2.UAA1	60	9
baneNorLundamoStavne.J1.JE8.WBC1	63	1
baneNorLundamoStavne.J1.KL6.KL1.UAA1	65	9
baneNorLundamoStavne.J1.KL6.KL1.QBA1	66	5
baneNorLundamoStavne.J1.KL6.JE1.WBC1	67	1
baneNorLundamoStavne.J1.KL6.JE1.WBC2	68	3
baneNorLundamoStavne.J1.KL6.KL2.UAA1	71	9
baneNorLundamoStavne.J1.KL6.KL2.QBA1	72	7
baneNorLundamoStavne.J1.JE9.WBC1	73	1
baneNorLundamoStavne.J1.KL5.JE1.XBA1	59	\N
baneNorLundamoStavne.J1.KL5.KL2.QBA1	61	\N
baneNorLundamoStavne.J1.KL5.WBC1	62	\N
baneNorLundamoStavne.J1.JE8.WBC2	64	\N
baneNorLundamoStavne.J1.KL6.JE1.QBA1	69	\N
baneNorLundamoStavne.J1.KL6.JE1.XBA1	70	\N
baneNorLundamoStavne	74	\N
baneNorLundamoStavne.J1.KL1	78	1
baneNorLundamoStavne.J1.KL2	80	1
baneNorLundamoStavne.J1.KL3	82	1
baneNorLundamoStavne.J1.KL4	84	1
baneNorLundamoStavne.J1.JE1.WBC1	1	\N
baneNorLundamoStavne.J1.JE1.QBA1	2	\N
baneNorLundamoStavne.J1.KL1.JE1.XBA1	9	\N
baneNorLundamoStavne.J1.KL2.JE1.XBA1	19	\N
baneNorLundamoStavne.J1.KL4.JE1.QBA1	36	5
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
baneNorLundamoStavne.J1.KL2.JE1	96	2
baneNorLundamoStavne.J1.KL1.KL1.UAA1	4	9
baneNorLundamoStavne.J1.KL1.KL1.QBA1	5	8
baneNorLundamoStavne.J1.KL1.JE1.WBC1	6	1
baneNorLundamoStavne.J1.KL1.JE1.WBC2	7	3
baneNorLundamoStavne.J1.KL1.JE1.QBA1	8	5
baneNorLundamoStavne.J1.KL1.KL2.UAA1	10	9
baneNorLundamoStavne.J1.KL1.KL2.QBA1	11	8
baneNorLundamoStavne.J1.JE3.WBC1	12	1
baneNorLundamoStavne.J1.KL2.KL1.UAA1	14	9
baneNorLundamoStavne.J1.KL6.KL1	107	\N
baneNorLundamoStavne.J1.KL3.KL1.QBA1	24	5
baneNorLundamoStavne.J1.KL3.JE1.WBC1	25	1
baneNorLundamoStavne.J1.KL3.JE1.WBC2	26	3
baneNorLundamoStavne.J1.KL3.JE1.QBA1	27	5
baneNorLundamoStavne.J1.KL3.JE1	99	2
baneNorLundamoStavne.J1.KL3.KL2.UAA1	29	9
baneNorLundamoStavne.J1.KL5.KL1.UAA1	50	9
baneNorLundamoStavne.J1.KL5.JE1.WBC1	52	3
baneNorLundamoStavne.J1.KL6.KL2	108	\N
baneNorLundamoStavne.J1.KL5	87	1
baneNorLundamoStavne.J1.KL6	89	1
baneNorLundamoStavne.J1.KL1.JE1	93	2
baneNorLundamoStavne.J1.KL4.JE1	102	2
baneNorLundamoStavne.J1.KL5.JE1	106	3
baneNorLundamoStavne.J1.KL6.JE1	109	2
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
\.


--
-- Data for Name: connections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.connections (connection_id, node1_id, node2_id) FROM stdin;
8	67	66
6	71	65
7	65	67
9	65	62
10	66	63
11	66	61
12	61	54
13	54	56
14	56	55
15	54	51
16	55	52
17	55	60
18	60	45
19	45	47
20	47	46
21	46	43
22	45	42
23	71	73
24	67	83
25	83	70
26	56	84
27	84	59
28	47	85
29	47	50
\.


--
-- Data for Name: connections3; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.connections3 (node_1, node_2, id, point_realative) FROM stdin;
4	18	11	\N
18	6	10	\N
6	19	9	\N
19	7	8	\N
19	8	7	\N
8	20	6	\N
20	9	5	\N
20	10	4	\N
10	21	3	\N
21	11	2	\N
21	12	1	\N
12	22	12	\N
22	14	32	\N
22	15	33	\N
15	23	34	\N
23	6	35	\N
23	17	36	\N
17	24	37	\N
25	26	39	\N
26	27	40	\N
26	24	41	\N
25	30	42	\N
30	28	43	\N
28	29	44	\N
30	34	45	\N
34	35	46	\N
34	36	47	\N
36	37	48	\N
34	33	49	\N
33	31	50	\N
31	32	51	\N
33	38	52	\N
38	39	53	\N
38	42	54	\N
42	40	55	\N
40	41	56	\N
42	46	57	\N
46	47	58	\N
47	48	59	\N
48	49	60	\N
46	45	61	\N
45	43	62	\N
43	44	63	\N
45	50	64	\N
50	52	65	\N
52	51	66	\N
51	56	67	\N
56	57	68	\N
57	58	69	\N
58	59	70	\N
56	55	71	\N
55	53	72	\N
53	54	73	\N
55	60	74	\N
60	62	75	\N
62	61	76	\N
61	63	77	\N
62	67	78	\N
67	68	79	\N
67	69	80	\N
67	66	81	\N
66	64	82	\N
64	65	83	\N
66	70	84	\N
70	71	85	\N
71	119	86	\N
119	88	87	\N
88	87	88	\N
88	89	89	\N
87	91	90	\N
91	93	91	\N
87	94	92	\N
88	84	93	\N
84	95	94	\N
95	97	95	\N
97	96	96	\N
97	101	97	\N
101	102	98	\N
102	104	99	\N
101	100	100	\N
100	98	101	\N
98	99	102	\N
100	105	103	\N
74	72	107	\N
73	72	108	\N
79	78	110	\N
79	92	111	\N
92	89	112	\N
76	72	105	\N
72	79	109	-4, -4
77	76	104	-1, 1
75	74	106	-1, 1
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
30	30	31
31	31	32
32	32	33
33	32	34
34	34	35
35	34	36
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
\.


--
-- Data for Name: mitttre; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mitttre (id, path) FROM stdin;
42	BaneNOR.J1.KL4.QBA1
43	BaneNOR.J1.KL4.QBA2
44	BaneNOR.J1.KL4.QBA3
45	BaneNOR.J1.KL4.UAA1
46	BaneNOR.J1.KL4.UAA2
47	BaneNOR.J1.KL4.WBC2
50	BaneNOR.J1.KL4.XBA2
51	BaneNOR.J1.KL3.QBA1
52	BaneNOR.J1.KL3.QBA2
54	BaneNOR.J1.KL3.UAA1
55	BaneNOR.J1.KL3.UAA2
56	BaneNOR.J1.KL3.WBC2
59	BaneNOR.J1.KL3.XBA2
60	BaneNOR.J1.JE4.WBC2
61	BaneNOR.J1.JE3.WBC2
63	BaneNOR.J1.KL2.QBA2
65	BaneNOR.J1.KL2.UAA1
66	BaneNOR.J1.KL2.UAA2
67	BaneNOR.J1.KL2.WBC2
70	BaneNOR.J1.KL2.XBA2
71	BaneNOR.J1.JE2.WBC2
75	BaneNOR
76	BaneNOR.J2
77	BaneNOR.J1.JE2
78	BaneNOR.J1.JE3
79	BaneNOR.J1.JE4
80	BaneNOR.J1.KL2
81	BaneNOR.J1.KL3
82	BaneNOR.J1.KL4
83	BaneNOR.J1.KL2.WBC3
84	BaneNOR.J1.KL3.WBC3
85	BaneNOR.J1.KL4.WBC3
62	BaneNOR.J1.KL2.QBA1
73	BaneNOR.J1.JE2.XBA1
\.


--
-- Data for Name: secondTry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."secondTry"  FROM stdin;
\.


--
-- Data for Name: tree; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tree (id, path1) FROM stdin;
83	\N
84	\N
85	\N
42	\N
43	\N
44	\N
45	\N
46	\N
47	\N
50	\N
51	\N
52	\N
54	\N
55	\N
56	\N
59	\N
60	\N
61	\N
62	\N
63	\N
65	\N
66	\N
67	\N
70	\N
71	\N
73	\N
75	\N
76	\N
77	\N
78	\N
79	\N
80	\N
81	\N
82	\N
\.


--
-- Data for Name: tree3; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tree3 (id, path) FROM stdin;
1	Lundamo-Stavne-BaneNOR.RDS
2	Lundamo-Stavne-BaneNOR.RDS.J1
3	Lundamo-Stavne-BaneNOR.RDS.J1.JE1
4	Lundamo-Stavne-BaneNOR.RDS.J1.JE2
5	Lundamo-Stavne-BaneNOR.RDS.J1.JE3
6	Lundamo-Stavne-BaneNOR.RDS.J1.JE4
7	Lundamo-Stavne-BaneNOR.RDS.J1.JE5
8	Lundamo-Stavne-BaneNOR.RDS.J1.JE6
9	Lundamo-Stavne-BaneNOR.RDS.J1.JE7
10	Lundamo-Stavne-BaneNOR.RDS.J1.JE8
11	Lundamo-Stavne-BaneNOR.RDS.J1.JE9
12	Lundamo-Stavne-BaneNOR.RDS.J1.JE10
13	Lundamo-Stavne-BaneNOR.RDS.J1.JE11
14	Lundamo-Stavne-BaneNOR.RDS.J1.JE12
15	Lundamo-Stavne-BaneNOR.RDS.J1.JE13
16	Lundamo-Stavne-BaneNOR.RDS.J1.JE14
17	Lundamo-Stavne-BaneNOR.RDS.J1.JE15
18	Lundamo-Stavne-BaneNOR.RDS.J1.KL1
19	Lundamo-Stavne-BaneNOR.RDS.J1.KL2
20	Lundamo-Stavne-BaneNOR.RDS.J1.KL3
21	Lundamo-Stavne-BaneNOR.RDS.J1.KL4
22	Lundamo-Stavne-BaneNOR.RDS.J1.KL5
23	Lundamo-Stavne-BaneNOR.RDS.J1.KL6
24	Lundamo-Stavne-BaneNOR.RDS.J1.JE1.WBB1
25	Lundamo-Stavne-BaneNOR.RDS.J1.JE2.WBC1
26	Lundamo-Stavne-BaneNOR.RDS.J1.JE2.QBA1
27	Lundamo-Stavne-BaneNOR.RDS.J1.JE2.MAA1
28	Lundamo-Stavne-BaneNOR.RDS.J1.KL1.KL1.QBA1
29	Lundamo-Stavne-BaneNOR.RDS.J1.KL1.KL1.MAA1
30	Lundamo-Stavne-BaneNOR.RDS.J1.KL1.KL1.UAA1
31	Lundamo-Stavne-BaneNOR.RDS.J1.KL1.KL2.QBA1
32	Lundamo-Stavne-BaneNOR.RDS.J1.KL1.KL2.MAA1
33	Lundamo-Stavne-BaneNOR.RDS.J1.KL1.KL2.UAA1
34	Lundamo-Stavne-BaneNOR.RDS.J1.JE3.WBC1
35	Lundamo-Stavne-BaneNOR.RDS.J1.JE3.WBC2
36	Lundamo-Stavne-BaneNOR.RDS.J1.JE3.QBA1
37	Lundamo-Stavne-BaneNOR.RDS.J1.JE3.XBA1
38	Lundamo-Stavne-BaneNOR.RDS.J1.JE4.WBC1
39	Lundamo-Stavne-BaneNOR.RDS.J1.JE4.XBA1
40	Lundamo-Stavne-BaneNOR.RDS.J1.KL2.KL1.QBA1
41	Lundamo-Stavne-BaneNOR.RDS.J1.KL2.KL1.MAA1
42	Lundamo-Stavne-BaneNOR.RDS.J1.KL2.KL1.UAA1
43	Lundamo-Stavne-BaneNOR.RDS.J1.KL2.KL2.QBA1
46	Lundamo-Stavne-BaneNOR.RDS.J1.JE5.WBC1
47	Lundamo-Stavne-BaneNOR.RDS.J1.JE5.WBC2
48	Lundamo-Stavne-BaneNOR.RDS.J1.JE5.QBA1
49	Lundamo-Stavne-BaneNOR.RDS.J1.JE5.XBA1
50	Lundamo-Stavne-BaneNOR.RDS.J1.JE6.WBC1
51	Lundamo-Stavne-BaneNOR.RDS.J1.KL3.KL1.QBA1
52	Lundamo-Stavne-BaneNOR.RDS.J1.KL3.KL1.UAA1
53	Lundamo-Stavne-BaneNOR.RDS.J1.KL3.KL2.QBA1
54	Lundamo-Stavne-BaneNOR.RDS.J1.KL3.KL2.MAA1
55	Lundamo-Stavne-BaneNOR.RDS.J1.KL3.KL2.UAA1
56	Lundamo-Stavne-BaneNOR.RDS.J1.JE7.WBC1
57	Lundamo-Stavne-BaneNOR.RDS.J1.JE7.WBC2
58	Lundamo-Stavne-BaneNOR.RDS.J1.JE7.QBA1
59	Lundamo-Stavne-BaneNOR.RDS.J1.JE7.XBA1
60	Lundamo-Stavne-BaneNOR.RDS.J1.JE8.WBC1
61	Lundamo-Stavne-BaneNOR.RDS.J1.KL4.KL1.QBA1
62	Lundamo-Stavne-BaneNOR.RDS.J1.KL4.KL1.UAA1
63	Lundamo-Stavne-BaneNOR.RDS.J1.KL4.KL1.MAA1
64	Lundamo-Stavne-BaneNOR.RDS.J1.KL4.KL2.QBA1
65	Lundamo-Stavne-BaneNOR.RDS.J1.KL4.KL2.MAA1
66	Lundamo-Stavne-BaneNOR.RDS.J1.KL4.KL2.UAA1
67	Lundamo-Stavne-BaneNOR.RDS.J1.JE9.WBC1
68	Lundamo-Stavne-BaneNOR.RDS.J1.JE9.WBC2
69	Lundamo-Stavne-BaneNOR.RDS.J1.JE9.XBA1
70	Lundamo-Stavne-BaneNOR.RDS.J1.JE10.WBC1
71	Lundamo-Stavne-BaneNOR.RDS.J1.JE10.WBC2
72	Lundamo-Stavne-BaneNOR.RDS.J1.JE11.WBC1
73	Lundamo-Stavne-BaneNOR.RDS.J1.JE11.WBC2
74	Lundamo-Stavne-BaneNOR.RDS.J1.JE11.WBC3
75	Lundamo-Stavne-BaneNOR.RDS.J1.JE11.WBC4
76	Lundamo-Stavne-BaneNOR.RDS.J1.JE11.WBC5
77	Lundamo-Stavne-BaneNOR.RDS.J1.JE11.WBC6
78	Lundamo-Stavne-BaneNOR.RDS.J1.JE11.KL1.QBA1
79	Lundamo-Stavne-BaneNOR.RDS.J1.JE11.KL1.UAA1
80	Lundamo-Stavne-BaneNOR.RDS.J1.KL5.KL2.QBA1
81	Lundamo-Stavne-BaneNOR.RDS.J1.KL5.KL2.MAA1
82	Lundamo-Stavne-BaneNOR.RDS.J1.KL5.KL2.WBC1
83	Lundamo-Stavne-BaneNOR.RDS.J1.KL5.KL2.QBA2
84	Lundamo-Stavne-BaneNOR.RDS.J1.KL5.KL3.UAA1
85	Lundamo-Stavne-BaneNOR.RDS.J1.KL5.WBC1
86	Lundamo-Stavne-BaneNOR.RDS.J1.KL5.WBC2
87	Lundamo-Stavne-BaneNOR.RDS.J1.JE12.WBC1
88	Lundamo-Stavne-BaneNOR.RDS.J1.JE12.WBC2
89	Lundamo-Stavne-BaneNOR.RDS.J1.JE12.WBC3
90	Lundamo-Stavne-BaneNOR.RDS.J1.JE12.WBC4
91	Lundamo-Stavne-BaneNOR.RDS.J1.JE12.WBC5
92	Lundamo-Stavne-BaneNOR.RDS.J1.JE12.WBC6
93	Lundamo-Stavne-BaneNOR.RDS.J1.JE12.QBA1
94	Lundamo-Stavne-BaneNOR.RDS.J1.JE12.XBA1
95	Lundamo-Stavne-BaneNOR.RDS.J1.JE13.WBC1
96	Lundamo-Stavne-BaneNOR.RDS.J1.KL6.KL1.QBA1
97	Lundamo-Stavne-BaneNOR.RDS.J1.KL6.KL1.UAA1
98	Lundamo-Stavne-BaneNOR.RDS.J1.KL6.KL2.QBA1
99	Lundamo-Stavne-BaneNOR.RDS.J1.KL6.KL2.MAA1
100	Lundamo-Stavne-BaneNOR.RDS.J1.KL6.KL2.UAA1
101	Lundamo-Stavne-BaneNOR.RDS.J1.JE14.WBC1
102	Lundamo-Stavne-BaneNOR.RDS.J1.JE14.WBC2
103	Lundamo-Stavne-BaneNOR.RDS.J1.JE14.QBA1
104	Lundamo-Stavne-BaneNOR.RDS.J1.JE14.XBA1
105	Lundamo-Stavne-BaneNOR.RDS.J1.JE15.WBC1
106	Lundamo-Stavne-BaneNOR.RDS.J1.KL1.KL1
107	Lundamo-Stavne-BaneNOR.RDS.J1.KL1.KL2
108	Lundamo-Stavne-BaneNOR.RDS.J1.KL2.KL1
109	Lundamo-Stavne-BaneNOR.RDS.J1.KL2.KL2
110	Lundamo-Stavne-BaneNOR.RDS.J1.KL3.KL1
111	Lundamo-Stavne-BaneNOR.RDS.J1.KL3.KL2
112	Lundamo-Stavne-BaneNOR.RDS.J1.KL4.KL1
113	Lundamo-Stavne-BaneNOR.RDS.J1.KL4.KL2
114	Lundamo-Stavne-BaneNOR.RDS.J1.KL5.KL1
115	Lundamo-Stavne-BaneNOR.RDS.J1.KL5.KL2
116	Lundamo-Stavne-BaneNOR.RDS.J1.KL5.KL3
117	Lundamo-Stavne-BaneNOR.RDS.J1.KL6.KL1
118	Lundamo-Stavne-BaneNOR.RDS.J1.KL6.KL2
44	Lundamo-Stavne-BaneNOR.RDS.J1.KL2.KL2.MAA1
45	Lundamo-Stavne-BaneNOR.RDS.J1.KL2.KL2.UAA1
119	Lundamo-Stavne-BaneNOR.RDS.J1.KL5.KL1.UAA1
120	Lundamo-Stavne-BaneNOR.RDS.J1.JE11.KL1
\.


--
-- Data for Name: treny; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.treny (path, id) FROM stdin;
BaneNOR.J1.KL4.QBA1	42
BaneNOR.J1.KL4.QBA2	43
BaneNOR.J1.KL4.QBA3	44
BaneNOR.J1.KL4.UAA1	45
BaneNOR.J1.KL4.UAA2	46
BaneNOR.J1.KL4.WBC1	47
BaneNOR.J1.KL4.XBA1	50
BaneNOR.J1.JE4.WBC1	60
BaneNOR.J1.JE3.WBC1	61
BaneNOR.J1.KL2.QBA1	62
BaneNOR.J1.KL2.QBA2	63
BaneNOR.J1.KL2.UAA1	65
BaneNOR.J1.KL2.UAA2	66
BaneNOR.J1.KL2.WBC1	67
BaneNOR.J1.KL2.XBA1	70
BaneNOR.J1.JE2.WBC1	71
BaneNOR.J1.JE2.XBA1	73
BaneNOR	75
BaneNOR.J1	76
BaneNOR.J1.JE2	77
BaneNOR.J1.JE3	78
BaneNOR.J1.JE4	79
BaneNOR.J1.KL2	80
BaneNOR.J1.KL4	82
BaneNOR.J1.KL2.WBC2	83
BaneNOR.J1.KL4.WBC2	85
\.


--
-- Data for Name: type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type (id, type) FROM stdin;
26	QBA1\n
28	QBA2
106	KL1
36	QBA1
30	UAA1
107	KL1
31	QBA2
33	UAA1
40	QBA2
42	UAA1
43	QBA2
45	UAA1
108	KL1
109	KL1
48	QBA1
51	QBA1
52	UAA1
53	QBA2
55	UAA1
110	KL1
111	KL1
58	QBA1
61	QBA2
62	UAA1
64	QBA2
66	UAA1
112	KL1
113	KL1
120	KL2
79	UAA1
119	UAA2
78	QBA1
84	UAA2
97	UAA1
96	QBA1
100	UAA1
98	QBA1
117	KL1
118	KL1
\.


--
-- Data for Name: type4; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type4 (id, type) FROM stdin;
3	WBC1
4	UAA1
5	QBA4
6	WBC1
7	WBC3
8	QBA1
10	UAA1
11	QBA4
12	WBC1
14	UAA1
15	QBA4
16	WBC1
17	WBC3
18	QBA1
20	UAA1
21	QBA4
22	WBC1
23	UAA1
24	QBA1
25	WBC1
26	WBC3
27	QBA1
29	UAA1
30	QBA4
31	WBC1
32	UAA1
33	QBA4
34	WBC1
35	WBC3
38	UAA1
39	QBA4
40	WBC1
50	UAA1
53	WBC1
52	WBC3
54	WBC3
55	WBC2
60	UAA1
63	WBC1
65	UAA1
66	QBA1
67	WBC1
68	WBC3
69	QBA1
71	UAA1
72	QBA3
73	WBC1
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
null	0
JE1	13
JE2	14
JE3	15
\.


--
-- Name: alternativ4_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alternativ4_id_seq', 109, true);


--
-- Name: alternativ4_type_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alternativ4_type_seq', 109, true);


--
-- Name: connections4_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.connections4_id_seq', 57, true);


--
-- Name: connections_connection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.connections_connection_id_seq', 112, true);


--
-- Name: treeA3_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."treeA3_id_seq"', 120, true);


--
-- Name: tree_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tree_id_seq', 85, true);


--
-- Name: typeMenNy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."typeMenNy_id_seq"', 15, true);


--
-- Name: alternativ4 alternativ4_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alternativ4
    ADD CONSTRAINT alternativ4_pkey PRIMARY KEY (id);


--
-- Name: connections3 connections3_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections3
    ADD CONSTRAINT connections3_pkey PRIMARY KEY (id);


--
-- Name: connections4 connections4_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections4
    ADD CONSTRAINT connections4_pkey PRIMARY KEY (id);


--
-- Name: connections connections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_pkey PRIMARY KEY (connection_id);


--
-- Name: mitttre mitttre_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mitttre
    ADD CONSTRAINT mitttre_pkey PRIMARY KEY (id);


--
-- Name: tree3 treeA3_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tree3
    ADD CONSTRAINT "treeA3_pkey" PRIMARY KEY (id);


--
-- Name: tree tree_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tree
    ADD CONSTRAINT tree_pkey PRIMARY KEY (id);


--
-- Name: treny treny_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.treny
    ADD CONSTRAINT treny_pkey PRIMARY KEY (id);


--
-- Name: type4 type4_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type4
    ADD CONSTRAINT type4_pkey PRIMARY KEY (id);


--
-- Name: type_men_ny typeMenNy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_men_ny
    ADD CONSTRAINT "typeMenNy_pkey" PRIMARY KEY (id);


--
-- Name: type type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_pkey PRIMARY KEY (id);


--
-- Name: connections3 connections3_node_1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections3
    ADD CONSTRAINT connections3_node_1_fkey FOREIGN KEY (node_1) REFERENCES public.tree3(id);


--
-- Name: connections3 connections3_node_2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections3
    ADD CONSTRAINT connections3_node_2_fkey FOREIGN KEY (node_2) REFERENCES public.tree3(id);


--
-- Name: connections connections_node1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_node1_id_fkey FOREIGN KEY (node1_id) REFERENCES public.tree(id);


--
-- Name: connections connections_node2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_node2_id_fkey FOREIGN KEY (node2_id) REFERENCES public.tree(id);


--
-- Name: alternativ4 object_type; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alternativ4
    ADD CONSTRAINT object_type FOREIGN KEY (type) REFERENCES public.type_men_ny(id);


--
-- PostgreSQL database dump complete
--

