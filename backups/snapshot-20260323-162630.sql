--
-- PostgreSQL database dump
--

\restrict n9wvd2QmaKuzIGMzcfDHEqMK4EBGZCLteRJeKn3KFE79TXlePKHZ2JJ6AJClaK5

-- Dumped from database version 17.8 (a284a84)
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: forma_pagamento; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.forma_pagamento AS ENUM (
    'boleto',
    'cartao',
    'pix',
    'deposito',
    'cheque',
    'especie'
);


--
-- Name: funcao_usuario; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.funcao_usuario AS ENUM (
    'admin',
    'loja',
    'fornecedor',
    'usuario'
);


--
-- Name: status_pedido; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.status_pedido AS ENUM (
    'pendente',
    'enviado',
    'entregue',
    'cancelado',
    'processando'
);


--
-- Name: status_promocao; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.status_promocao AS ENUM (
    'ativo',
    'inativo'
);


--
-- Name: usuario_funcao; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.usuario_funcao AS ENUM (
    'admin',
    'loja',
    'fornecedor'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: campanhaspromocionais; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campanhaspromocionais (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying(255) NOT NULL,
    descricao text,
    valor_min numeric(10,2) NOT NULL,
    quantidade_min integer NOT NULL,
    desconto_porcentagem numeric(5,2) NOT NULL,
    status public.status_promocao NOT NULL,
    criado_em timestamp without time zone,
    atualizado_em timestamp without time zone,
    deletado_em timestamp without time zone,
    fornecedor_id uuid
);


--
-- Name: condicoescomerciais; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.condicoescomerciais (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    uf character varying(2) NOT NULL,
    cashback_porcentagem numeric(5,2),
    prazo_extendido_dias integer,
    variacao_unitario numeric(10,2),
    criado_em timestamp without time zone,
    atualizado_em timestamp without time zone,
    deletado_em timestamp without time zone,
    fornecedor_id uuid
);


--
-- Name: enderecos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enderecos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    estado character varying(2) NOT NULL,
    cidade character varying(100) NOT NULL,
    bairro character varying(100) NOT NULL,
    rua character varying(255) NOT NULL,
    numero character varying(20) NOT NULL,
    cep character varying(8) NOT NULL,
    criado_em timestamp without time zone,
    atualizado_em timestamp without time zone,
    deletado_em timestamp without time zone,
    complemento character varying(100)
);


--
-- Name: fornecedores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fornecedores (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    cnpj character varying(18) NOT NULL,
    descricao text,
    usuario_id uuid,
    criado_em timestamp without time zone,
    atualizado_em timestamp without time zone,
    deletado_em timestamp without time zone,
    nome_fantasia character varying(100),
    razao_social character varying(150)
);


--
-- Name: lojas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lojas (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    endereco_id uuid,
    nome character varying(255) NOT NULL,
    usuario_id uuid,
    criado_em timestamp without time zone,
    atualizado_em timestamp without time zone,
    deletado_em timestamp without time zone,
    cnpj character varying(18) NOT NULL
);


--
-- Name: pedidoproduto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pedidoproduto (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    pedido_id uuid,
    produto_id uuid,
    quantidade integer NOT NULL,
    valor_unitario numeric(10,2) NOT NULL,
    criado_em timestamp without time zone,
    atualizado_em timestamp without time zone,
    deletado_em timestamp without time zone
);


--
-- Name: pedidos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pedidos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    valor_total numeric(10,2) NOT NULL,
    descricao text,
    usuario_id uuid,
    loja_id uuid,
    status public.status_pedido NOT NULL,
    forma_pagamento public.forma_pagamento NOT NULL,
    prazo_dias integer NOT NULL,
    criado_em timestamp without time zone,
    enviado_em timestamp without time zone,
    entregue_em timestamp without time zone,
    deletado_em timestamp without time zone,
    fornecedor_id uuid
);


--
-- Name: produtos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.produtos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying(255) NOT NULL,
    descricao text,
    valor_unitario numeric(10,2) NOT NULL,
    quantidade_estoque integer NOT NULL,
    fornecedor_id uuid,
    categoria character varying(50) NOT NULL,
    criado_em timestamp without time zone,
    atualizado_em timestamp without time zone,
    deletado_em timestamp without time zone,
    imagem_url text
);


--
-- Name: COLUMN produtos.imagem_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.produtos.imagem_url IS 'URL da imagem do produto (opcional)';


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying(100) NOT NULL,
    sobrenome character varying(100) NOT NULL,
    senha character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    email_verificado boolean DEFAULT false,
    telefone character varying(20),
    funcao public.funcao_usuario NOT NULL,
    criado_em timestamp without time zone,
    atualizado_em timestamp without time zone,
    deletado_em timestamp without time zone,
    endereco_id uuid
);


--
-- Data for Name: campanhaspromocionais; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.campanhaspromocionais (id, nome, descricao, valor_min, quantidade_min, desconto_porcentagem, status, criado_em, atualizado_em, deletado_em, fornecedor_id) FROM stdin;
5ac0bcbc-915a-4876-b8e2-f1484cd657dd	Workstation Build Week	Volume discount for stores purchasing components for workstation kits.	5000.00	1	12.00	ativo	2026-03-23 14:18:06.784	2026-03-23 16:26:23.069	\N	1b662f35-d60c-4ae1-9fc6-e48547b517ee
e7556076-0b1e-4c17-8cff-7b306541a541	Embedded Lab Starter	Special deal for educational institutions buying microcontrollers and dev boards.	0.00	40	9.00	ativo	2026-03-23 14:18:07.242	2026-03-23 16:26:23.594	\N	1b662f35-d60c-4ae1-9fc6-e48547b517ee
\.


--
-- Data for Name: condicoescomerciais; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.condicoescomerciais (id, uf, cashback_porcentagem, prazo_extendido_dias, variacao_unitario, criado_em, atualizado_em, deletado_em, fornecedor_id) FROM stdin;
4b6918a4-0e30-42f2-9e78-b6a33bb84f0b	RS	2.00	6	10.00	2026-03-23 16:15:20.204	2026-03-23 16:15:20.204	\N	1b662f35-d60c-4ae1-9fc6-e48547b517ee
c4406ec2-a0ba-4e5d-9106-a3164e6c402a	SC	2.50	10	-1.50	2026-03-23 14:09:04.207	2026-03-23 16:26:21.981	\N	1b662f35-d60c-4ae1-9fc6-e48547b517ee
2a0ed324-803f-42ec-8556-dfd1df7d5710	PR	1.75	7	0.00	2026-03-23 14:09:04.68	2026-03-23 16:26:22.489	\N	1b662f35-d60c-4ae1-9fc6-e48547b517ee
\.


--
-- Data for Name: enderecos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.enderecos (id, estado, cidade, bairro, rua, numero, cep, criado_em, atualizado_em, deletado_em, complemento) FROM stdin;
7e6d6c2d-a6d7-4717-87a5-baefb1a60597	SC	Criciuma	Centro	Rua da Demo	101	88800000	2026-03-23 14:09:00.295	2026-03-23 16:26:18.161	\N	Sala A
92b43523-b596-4cad-b3cf-004c73080d6a	SC	Criciuma	Próspera	Avenida Fornecedor	220	88801100	2026-03-23 14:09:00.814	2026-03-23 16:26:18.641	\N	Galpão 3
1c066e20-7947-429e-873a-f189cac120ed	SC	Criciuma	Santa Barbara	Rua Compras	55	88802200	2026-03-23 14:09:01.337	2026-03-23 16:26:19.128	\N	Loja 2
\.


--
-- Data for Name: fornecedores; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fornecedores (id, cnpj, descricao, usuario_id, criado_em, atualizado_em, deletado_em, nome_fantasia, razao_social) FROM stdin;
1b662f35-d60c-4ae1-9fc6-e48547b517ee	11222333000181	Fornecedor de demonstração para ambiente acadêmico	0eac0fd9-2102-4c7f-9458-455dc83d0e8e	2026-03-23 14:09:03.205	2026-03-23 16:26:21.085	\N	Fornecedor Demo	Fornecedor Demo LTDA
\.


--
-- Data for Name: lojas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lojas (id, endereco_id, nome, usuario_id, criado_em, atualizado_em, deletado_em, cnpj) FROM stdin;
bc696271-5222-45d7-b39d-d7c7ac30f35e	1c066e20-7947-429e-873a-f189cac120ed	Loja Demo Centro	8d8f8b10-4f8f-4fb1-acd6-3b9b9219a5b6	2026-03-23 14:09:03.727	2026-03-23 16:26:21.528	\N	55444333000199
\.


--
-- Data for Name: pedidoproduto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pedidoproduto (id, pedido_id, produto_id, quantidade, valor_unitario, criado_em, atualizado_em, deletado_em) FROM stdin;
0bb50d4b-5d15-4d79-9904-48006d1c658c	67a1c078-b686-444c-afae-79c64065f4bb	ad923398-684e-4277-a851-2ac20e4b4681	1	2699.00	2026-03-23 16:13:40.74	2026-03-23 16:13:40.74	\N
55cbc032-ef0e-4c68-8510-f125a893401b	67a1c078-b686-444c-afae-79c64065f4bb	c85832d6-6e66-4fb5-9d24-37d4d0ca5072	1	2999.00	2026-03-23 16:13:40.74	2026-03-23 16:13:40.74	\N
3f92c139-9371-4d26-83b4-831a7da8719f	67a1c078-b686-444c-afae-79c64065f4bb	e03fbb68-043b-4aab-a566-347a9dc443df	1	789.50	2026-03-23 16:13:40.74	2026-03-23 16:13:40.74	\N
c47cd516-12c9-47ef-ab73-c9bef27feac3	76f2c2b8-5c36-4909-837d-4eeb463efcaf	45be3238-6979-4ece-803d-0ed4e254cedd	2	4399.90	2026-03-23 14:18:11.964	2026-03-23 14:18:11.964	2026-03-23 19:16:31.48133
58aab5f4-3ba3-48dc-baca-cf6adb8057a1	76f2c2b8-5c36-4909-837d-4eeb463efcaf	ad923398-684e-4277-a851-2ac20e4b4681	2	2699.00	2026-03-23 14:18:12.183	2026-03-23 14:18:12.183	2026-03-23 19:16:31.48133
3950b22d-af38-4e66-8202-0418471d2325	76f2c2b8-5c36-4909-837d-4eeb463efcaf	9c38c11b-86cd-4166-aa44-1f5c406b305b	10	74.90	2026-03-23 14:18:12.399	2026-03-23 14:18:12.399	2026-03-23 19:16:31.48133
5576b88b-e571-48f1-9c1d-4e8ee939496d	76f2c2b8-5c36-4909-837d-4eeb463efcaf	4ebf4ee9-26a8-4ba8-8dce-924ff812d3ce	4	999.00	2026-03-23 14:18:12.641	2026-03-23 14:18:12.641	2026-03-23 19:16:31.48133
163da701-3859-4126-9eca-f9fee98fc5f7	76f2c2b8-5c36-4909-837d-4eeb463efcaf	45be3238-6979-4ece-803d-0ed4e254cedd	2	4399.90	2026-03-23 16:16:31.543	2026-03-23 16:16:31.543	2026-03-23 19:20:53.148414
d1e6004b-1e56-4f1c-bc7a-d4e2a35a4d56	76f2c2b8-5c36-4909-837d-4eeb463efcaf	ad923398-684e-4277-a851-2ac20e4b4681	2	2699.00	2026-03-23 16:16:31.893	2026-03-23 16:16:31.893	2026-03-23 19:20:53.148414
0c9ef5e7-7049-4e62-b52a-c0dc6027ba8b	76f2c2b8-5c36-4909-837d-4eeb463efcaf	9c38c11b-86cd-4166-aa44-1f5c406b305b	10	74.90	2026-03-23 16:16:32.228	2026-03-23 16:16:32.228	2026-03-23 19:20:53.148414
c893feca-ed6e-473a-a308-cae842a25a37	76f2c2b8-5c36-4909-837d-4eeb463efcaf	4ebf4ee9-26a8-4ba8-8dce-924ff812d3ce	4	999.00	2026-03-23 16:16:32.559	2026-03-23 16:16:32.559	2026-03-23 19:20:53.148414
91d7c8b1-5842-46fd-8c1b-e891ec556d5c	76f2c2b8-5c36-4909-837d-4eeb463efcaf	45be3238-6979-4ece-803d-0ed4e254cedd	2	4399.90	2026-03-23 16:20:53.208	2026-03-23 16:20:53.208	2026-03-23 19:26:29.050942
a404958d-209c-432a-bae7-6133b98d2dba	76f2c2b8-5c36-4909-837d-4eeb463efcaf	ad923398-684e-4277-a851-2ac20e4b4681	2	2699.00	2026-03-23 16:20:53.547	2026-03-23 16:20:53.547	2026-03-23 19:26:29.050942
cb66338a-597b-497f-b2d7-2cb4d55e09fd	76f2c2b8-5c36-4909-837d-4eeb463efcaf	9c38c11b-86cd-4166-aa44-1f5c406b305b	10	74.90	2026-03-23 16:20:53.875	2026-03-23 16:20:53.875	2026-03-23 19:26:29.050942
d19ff75f-abdb-45ab-a27a-761c2b90c777	76f2c2b8-5c36-4909-837d-4eeb463efcaf	4ebf4ee9-26a8-4ba8-8dce-924ff812d3ce	4	999.00	2026-03-23 16:20:54.202	2026-03-23 16:20:54.202	2026-03-23 19:26:29.050942
0d4b2751-01fb-48cf-a5a9-c0c331e0a57d	76f2c2b8-5c36-4909-837d-4eeb463efcaf	45be3238-6979-4ece-803d-0ed4e254cedd	2	4399.90	2026-03-23 16:26:29.084	2026-03-23 16:26:29.084	\N
981d9988-0912-4688-85a0-2959d865fa4a	76f2c2b8-5c36-4909-837d-4eeb463efcaf	ad923398-684e-4277-a851-2ac20e4b4681	2	2699.00	2026-03-23 16:26:29.332	2026-03-23 16:26:29.332	\N
64b1c5f4-595a-458f-b01c-761903f1c396	76f2c2b8-5c36-4909-837d-4eeb463efcaf	9c38c11b-86cd-4166-aa44-1f5c406b305b	10	74.90	2026-03-23 16:26:29.58	2026-03-23 16:26:29.58	\N
e82d6fae-8672-4108-bd89-90864c0a3ffb	76f2c2b8-5c36-4909-837d-4eeb463efcaf	4ebf4ee9-26a8-4ba8-8dce-924ff812d3ce	4	999.00	2026-03-23 16:26:29.856	2026-03-23 16:26:29.856	\N
\.


--
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pedidos (id, valor_total, descricao, usuario_id, loja_id, status, forma_pagamento, prazo_dias, criado_em, enviado_em, entregue_em, deletado_em, fornecedor_id) FROM stdin;
67a1c078-b686-444c-afae-79c64065f4bb	5709.00	Pedido via checkout - 3 produto(s)	8d8f8b10-4f8f-4fb1-acd6-3b9b9219a5b6	bc696271-5222-45d7-b39d-d7c7ac30f35e	pendente	pix	17	2026-03-23 16:13:40.391	\N	\N	\N	1b662f35-d60c-4ae1-9fc6-e48547b517ee
76f2c2b8-5c36-4909-837d-4eeb463efcaf	18942.80	Pedido demo inicial	8d8f8b10-4f8f-4fb1-acd6-3b9b9219a5b6	bc696271-5222-45d7-b39d-d7c7ac30f35e	entregue	pix	7	2026-03-23 14:18:11.731	\N	\N	\N	1b662f35-d60c-4ae1-9fc6-e48547b517ee
\.


--
-- Data for Name: produtos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.produtos (id, nome, descricao, valor_unitario, quantidade_estoque, fornecedor_id, categoria, criado_em, atualizado_em, deletado_em, imagem_url) FROM stdin;
45be3238-6979-4ece-803d-0ed4e254cedd	NVIDIA RTX 4070 Super 12GB	High-performance graphics card for CAD, rendering, and AI workloads.	4399.90	18	1b662f35-d60c-4ae1-9fc6-e48547b517ee	GPUs	2026-03-23 14:18:07.668	2026-03-23 16:26:24.171	\N	https://images.unsplash.com/photo-1591489378430-ef2f4c626b35
ad923398-684e-4277-a851-2ac20e4b4681	AMD Ryzen 7 7800X3D	8-core CPU with outstanding gaming and simulation performance.	2699.00	25	1b662f35-d60c-4ae1-9fc6-e48547b517ee	CPUs	2026-03-23 14:18:08.135	2026-03-23 16:26:24.698	\N	https://images.unsplash.com/photo-1518773553398-650c184e0bb3
e03fbb68-043b-4aab-a566-347a9dc443df	Keychron K8 Pro Mechanical Keyboard	Wireless mechanical keyboard with hot-swappable switches and RGB backlight.	789.50	60	1b662f35-d60c-4ae1-9fc6-e48547b517ee	Peripherals	2026-03-23 14:18:08.613	2026-03-23 16:26:25.147	\N	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef
552392d5-4693-420e-a7a4-626da9da1ba9	Logitech MX Master 3S	Precision productivity mouse with silent clicks and USB-C charging.	549.90	75	1b662f35-d60c-4ae1-9fc6-e48547b517ee	Peripherals	2026-03-23 14:18:09.058	2026-03-23 16:26:25.619	\N	https://images.unsplash.com/photo-1527814050087-3793815479db
b41f352c-5c3d-4fb2-bed9-d18fa0988f28	Samsung 990 Pro 2TB NVMe SSD	PCIe 4.0 NVMe SSD for ultra-fast boot times and project load speeds.	1249.00	42	1b662f35-d60c-4ae1-9fc6-e48547b517ee	Storage	2026-03-23 14:18:09.495	2026-03-23 16:26:26.126	\N	https://images.unsplash.com/photo-1591799265444-d66432b91588
173a0804-15b4-4b3b-8475-277b4a7414ea	Raspberry Pi 5 - 8GB	Single-board computer for prototyping IoT gateways and edge automation.	689.90	50	1b662f35-d60c-4ae1-9fc6-e48547b517ee	Embedded	2026-03-23 14:18:09.926	2026-03-23 16:26:26.642	\N	https://images.unsplash.com/photo-1553406830-ef2513450d76
9c38c11b-86cd-4166-aa44-1f5c406b305b	ESP32 DevKit V1	Wi-Fi and Bluetooth microcontroller board for IoT and telemetry projects.	74.90	220	1b662f35-d60c-4ae1-9fc6-e48547b517ee	Microcontrollers	2026-03-23 14:18:10.361	2026-03-23 16:26:27.099	\N	https://images.unsplash.com/photo-1517420704952-d9f39e95b43e
4ebf4ee9-26a8-4ba8-8dce-924ff812d3ce	Ubiquiti UniFi 6 Lite Access Point	Dual-band Wi-Fi 6 access point for high-density office coverage.	999.00	30	1b662f35-d60c-4ae1-9fc6-e48547b517ee	Networking	2026-03-23 14:18:10.811	2026-03-23 16:26:27.568	\N	https://images.unsplash.com/photo-1520869562399-e772f042f422
c85832d6-6e66-4fb5-9d24-37d4d0ca5072	Dell UltraSharp 27 4K USB-C	Color-accurate 27-inch 4K monitor for design and development teams.	2999.00	22	1b662f35-d60c-4ae1-9fc6-e48547b517ee	Displays	2026-03-23 14:18:11.276	2026-03-23 16:26:28.09	\N	https://images.unsplash.com/photo-1527443224154-c4a3942d3acf
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id, nome, sobrenome, senha, email, email_verificado, telefone, funcao, criado_em, atualizado_em, deletado_em, endereco_id) FROM stdin;
59798818-3af7-4be5-891a-cf95f8f3aad3	Admin	Demo	$2b$12$ajdxP1qJdesd8LpEEPYzQO4Hbn8gsOOnuthb.pyrb7v805lTBvfi2	admin@demo.com	t	+5511999990001	admin	2026-03-23 14:09:01.796	2026-03-23 16:26:19.662	\N	7e6d6c2d-a6d7-4717-87a5-baefb1a60597
0eac0fd9-2102-4c7f-9458-455dc83d0e8e	Fornecedor	Demo	$2b$12$ajdxP1qJdesd8LpEEPYzQO4Hbn8gsOOnuthb.pyrb7v805lTBvfi2	fornecedor@demo.com	t	+5511999990002	fornecedor	2026-03-23 14:09:02.274	2026-03-23 16:26:20.19	\N	92b43523-b596-4cad-b3cf-004c73080d6a
8d8f8b10-4f8f-4fb1-acd6-3b9b9219a5b6	Usuario	Demo	$2b$12$ajdxP1qJdesd8LpEEPYzQO4Hbn8gsOOnuthb.pyrb7v805lTBvfi2	usuario@demo.com	t	+5511999990003	loja	2026-03-23 14:09:02.735	2026-03-23 16:26:20.653	\N	1c066e20-7947-429e-873a-f189cac120ed
\.


--
-- Name: campanhaspromocionais campanhaspromocionais_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campanhaspromocionais
    ADD CONSTRAINT campanhaspromocionais_pkey PRIMARY KEY (id);


--
-- Name: condicoescomerciais condicoescomerciais_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.condicoescomerciais
    ADD CONSTRAINT condicoescomerciais_pkey PRIMARY KEY (id);


--
-- Name: enderecos enderecos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enderecos
    ADD CONSTRAINT enderecos_pkey PRIMARY KEY (id);


--
-- Name: fornecedores fornecedores_cnpj_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fornecedores
    ADD CONSTRAINT fornecedores_cnpj_key UNIQUE (cnpj);


--
-- Name: fornecedores fornecedores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fornecedores
    ADD CONSTRAINT fornecedores_pkey PRIMARY KEY (id);


--
-- Name: lojas lojas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lojas
    ADD CONSTRAINT lojas_pkey PRIMARY KEY (id);


--
-- Name: pedidoproduto pedidoproduto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidoproduto
    ADD CONSTRAINT pedidoproduto_pkey PRIMARY KEY (id);


--
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (id);


--
-- Name: produtos produtos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: campanhaspromocionais campanhaspromocionais_fornecedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campanhaspromocionais
    ADD CONSTRAINT campanhaspromocionais_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES public.fornecedores(id);


--
-- Name: condicoescomerciais condicoescomerciais_fornecedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.condicoescomerciais
    ADD CONSTRAINT condicoescomerciais_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES public.fornecedores(id);


--
-- Name: fornecedores fornecedores_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fornecedores
    ADD CONSTRAINT fornecedores_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: lojas lojas_endereco_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lojas
    ADD CONSTRAINT lojas_endereco_id_fkey FOREIGN KEY (endereco_id) REFERENCES public.enderecos(id);


--
-- Name: lojas lojas_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lojas
    ADD CONSTRAINT lojas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: pedidoproduto pedidoproduto_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidoproduto
    ADD CONSTRAINT pedidoproduto_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id);


--
-- Name: pedidoproduto pedidoproduto_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidoproduto
    ADD CONSTRAINT pedidoproduto_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produtos(id);


--
-- Name: pedidos pedidos_fornecedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES public.fornecedores(id);


--
-- Name: pedidos pedidos_loja_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_loja_id_fkey FOREIGN KEY (loja_id) REFERENCES public.lojas(id);


--
-- Name: pedidos pedidos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: produtos produtos_fornecedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES public.fornecedores(id);


--
-- Name: usuarios usuarios_endereco_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_endereco_id_fkey FOREIGN KEY (endereco_id) REFERENCES public.enderecos(id);


--
-- PostgreSQL database dump complete
--

\unrestrict n9wvd2QmaKuzIGMzcfDHEqMK4EBGZCLteRJeKn3KFE79TXlePKHZ2JJ6AJClaK5

