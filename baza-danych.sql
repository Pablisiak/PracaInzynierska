PGDMP  7                     }            woda    17.2    17.1 *    4           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            5           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            6           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            7           1262    16388    woda    DATABASE     w   CREATE DATABASE woda WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Polish_Poland.1250';
    DROP DATABASE woda;
                     postgres    false            �            1259    16470    awarie_id_seq    SEQUENCE     v   CREATE SEQUENCE public.awarie_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.awarie_id_seq;
       public               postgres    false            �            1259    16444    awarie    TABLE     �   CREATE TABLE public.awarie (
    id integer DEFAULT nextval('public.awarie_id_seq'::regclass) NOT NULL,
    id_klienta integer NOT NULL,
    komentarz text NOT NULL,
    status boolean DEFAULT false NOT NULL,
    odpowiedz text
);
    DROP TABLE public.awarie;
       public         heap r       postgres    false    224            �            1259    16471    faktury_id_seq    SEQUENCE     w   CREATE SEQUENCE public.faktury_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.faktury_id_seq;
       public               postgres    false            �            1259    16418    faktury    TABLE     ,  CREATE TABLE public.faktury (
    id integer DEFAULT nextval('public.faktury_id_seq'::regclass) NOT NULL,
    id_klienta integer NOT NULL,
    status_oplacenia boolean DEFAULT false NOT NULL,
    data_wystawienia date NOT NULL,
    kwota numeric(10,2) NOT NULL,
    zuzycie numeric(10,2) NOT NULL
);
    DROP TABLE public.faktury;
       public         heap r       postgres    false    225            �            1259    16472    klienci_id_seq    SEQUENCE     w   CREATE SEQUENCE public.klienci_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.klienci_id_seq;
       public               postgres    false            �            1259    16389    klienci    TABLE     �   CREATE TABLE public.klienci (
    id integer DEFAULT nextval('public.klienci_id_seq'::regclass) NOT NULL,
    imie character varying NOT NULL,
    nazwisko character varying NOT NULL,
    kod character varying NOT NULL
);
    DROP TABLE public.klienci;
       public         heap r       postgres    false    226            �            1259    16473    konta_id_seq    SEQUENCE     u   CREATE SEQUENCE public.konta_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.konta_id_seq;
       public               postgres    false            �            1259    16407    konta    TABLE     )  CREATE TABLE public.konta (
    id integer DEFAULT nextval('public.konta_id_seq'::regclass) NOT NULL,
    login character varying NOT NULL,
    haslo character varying NOT NULL,
    email character varying NOT NULL,
    czy_admin boolean DEFAULT false NOT NULL,
    id_klienta integer NOT NULL
);
    DROP TABLE public.konta;
       public         heap r       postgres    false    227            �            1259    16474    ogloszenia_id_seq    SEQUENCE     z   CREATE SEQUENCE public.ogloszenia_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.ogloszenia_id_seq;
       public               postgres    false            �            1259    16457 
   ogloszenia    TABLE     �   CREATE TABLE public.ogloszenia (
    id integer DEFAULT nextval('public.ogloszenia_id_seq'::regclass) NOT NULL,
    tytul text NOT NULL,
    opis text NOT NULL
);
    DROP TABLE public.ogloszenia;
       public         heap r       postgres    false    228            �            1259    16464    status    TABLE     s   CREATE TABLE public.status (
    stan_licznika boolean DEFAULT true NOT NULL,
    id integer DEFAULT 1 NOT NULL
);
    DROP TABLE public.status;
       public         heap r       postgres    false            �            1259    16475    zgloszenia_id_seq    SEQUENCE     z   CREATE SEQUENCE public.zgloszenia_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.zgloszenia_id_seq;
       public               postgres    false            �            1259    16431 
   zgloszenia    TABLE     �   CREATE TABLE public.zgloszenia (
    id integer DEFAULT nextval('public.zgloszenia_id_seq'::regclass) NOT NULL,
    id_klienta integer NOT NULL,
    status boolean DEFAULT false NOT NULL,
    odpowiedz text,
    stan numeric(10,2) NOT NULL
);
    DROP TABLE public.zgloszenia;
       public         heap r       postgres    false    229            )          0    16444    awarie 
   TABLE DATA           N   COPY public.awarie (id, id_klienta, komentarz, status, odpowiedz) FROM stdin;
    public               postgres    false    221   �.       '          0    16418    faktury 
   TABLE DATA           e   COPY public.faktury (id, id_klienta, status_oplacenia, data_wystawienia, kwota, zuzycie) FROM stdin;
    public               postgres    false    219   �/       %          0    16389    klienci 
   TABLE DATA           :   COPY public.klienci (id, imie, nazwisko, kod) FROM stdin;
    public               postgres    false    217   �0       &          0    16407    konta 
   TABLE DATA           O   COPY public.konta (id, login, haslo, email, czy_admin, id_klienta) FROM stdin;
    public               postgres    false    218   �1       *          0    16457 
   ogloszenia 
   TABLE DATA           5   COPY public.ogloszenia (id, tytul, opis) FROM stdin;
    public               postgres    false    222   �2       +          0    16464    status 
   TABLE DATA           3   COPY public.status (stan_licznika, id) FROM stdin;
    public               postgres    false    223   G3       (          0    16431 
   zgloszenia 
   TABLE DATA           M   COPY public.zgloszenia (id, id_klienta, status, odpowiedz, stan) FROM stdin;
    public               postgres    false    220   h3       8           0    0    awarie_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.awarie_id_seq', 6, true);
          public               postgres    false    224            9           0    0    faktury_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.faktury_id_seq', 21, true);
          public               postgres    false    225            :           0    0    klienci_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.klienci_id_seq', 11, true);
          public               postgres    false    226            ;           0    0    konta_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.konta_id_seq', 8, true);
          public               postgres    false    227            <           0    0    ogloszenia_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.ogloszenia_id_seq', 6, true);
          public               postgres    false    228            =           0    0    zgloszenia_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.zgloszenia_id_seq', 25, true);
          public               postgres    false    229            �           2606    16451    awarie awarie_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.awarie
    ADD CONSTRAINT awarie_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.awarie DROP CONSTRAINT awarie_pkey;
       public                 postgres    false    221            �           2606    16425    faktury faktury_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.faktury
    ADD CONSTRAINT faktury_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.faktury DROP CONSTRAINT faktury_pkey;
       public                 postgres    false    219            �           2606    16393    klienci klienci_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.klienci
    ADD CONSTRAINT klienci_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.klienci DROP CONSTRAINT klienci_pkey;
       public                 postgres    false    217            �           2606    16527    klienci kod 
   CONSTRAINT     E   ALTER TABLE ONLY public.klienci
    ADD CONSTRAINT kod UNIQUE (kod);
 5   ALTER TABLE ONLY public.klienci DROP CONSTRAINT kod;
       public                 postgres    false    217            �           2606    16412    konta konta_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.konta
    ADD CONSTRAINT konta_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.konta DROP CONSTRAINT konta_pkey;
       public                 postgres    false    218            �           2606    16463    ogloszenia ogloszenia_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.ogloszenia
    ADD CONSTRAINT ogloszenia_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.ogloszenia DROP CONSTRAINT ogloszenia_pkey;
       public                 postgres    false    222            �           2606    16530    status status_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.status
    ADD CONSTRAINT status_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.status DROP CONSTRAINT status_pkey;
       public                 postgres    false    223            �           2606    16438    zgloszenia zgloszenia_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.zgloszenia
    ADD CONSTRAINT zgloszenia_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.zgloszenia DROP CONSTRAINT zgloszenia_pkey;
       public                 postgres    false    220            �           2606    16413    konta id_klienta    FK CONSTRAINT     t   ALTER TABLE ONLY public.konta
    ADD CONSTRAINT id_klienta FOREIGN KEY (id_klienta) REFERENCES public.klienci(id);
 :   ALTER TABLE ONLY public.konta DROP CONSTRAINT id_klienta;
       public               postgres    false    4737    217    218            �           2606    16426    faktury id_klienta    FK CONSTRAINT     v   ALTER TABLE ONLY public.faktury
    ADD CONSTRAINT id_klienta FOREIGN KEY (id_klienta) REFERENCES public.klienci(id);
 <   ALTER TABLE ONLY public.faktury DROP CONSTRAINT id_klienta;
       public               postgres    false    219    4737    217            �           2606    16439    zgloszenia id_klienta    FK CONSTRAINT     y   ALTER TABLE ONLY public.zgloszenia
    ADD CONSTRAINT id_klienta FOREIGN KEY (id_klienta) REFERENCES public.klienci(id);
 ?   ALTER TABLE ONLY public.zgloszenia DROP CONSTRAINT id_klienta;
       public               postgres    false    217    220    4737            �           2606    16452    awarie id_klienta    FK CONSTRAINT     u   ALTER TABLE ONLY public.awarie
    ADD CONSTRAINT id_klienta FOREIGN KEY (id_klienta) REFERENCES public.klienci(id);
 ;   ALTER TABLE ONLY public.awarie DROP CONSTRAINT id_klienta;
       public               postgres    false    221    217    4737            )   �   x���1o�0Fg�W\�*�*f�V��b��L��cY��*
eA���{�jְ�����ף��	a#ц�)��C�P�٧G����	��C���ؐ'q�����%�淅��OZ�j�g��/ο;E�`��������Z����������u)B�\���-E|�|AE���i�oB��
��K7D@�U�Im|�	��T[���(���� �{z�      '   �   x�}�Kn!C�UwI�~���d���ӛ4�����)%oIO|y�H����E��GK�iY2�2�w
I�x��yHdY�D���];%�۠��S�I�v�\���|�A�J7w?�<�:�%��M���	_�۫PXs_uK��6�8��o�&��v�x}��a�*S�m0�4�f83�2��k���yqKR��m��R�i�      %   �   x�=��jAD��Xpl��P����8�`��.h����_�d�*x�+	��os[���r���=�y�����$FTp�ke�]���5�a��k���X��H�8f�x͜�k��<���q�G�*�v�5(岜��+�MF!	xX��?s"�>�b�)2��>O}Z�s��7�~��s�����r����X���	i*����W^ڊ�%��/�D�b�"��:$�{N�|\7���5�&'ttY��-"� ]�      &     x�U��r�0  �s��Y�T�����@����j#�I�2��;��L���C -Zҁ�F�6�"�rd�="�|�S�A�����lg�ST\w�{7rWo��-�_�JӬ!�B  �&�Rv�1;W�.wq��B��;JBY^N{;����3�3z�t�������~��+`�ɝ����E$�K�M��f_�琕��Mٰ���{�;O����0Nx�YL@w�Ӭkp
*^�7m�ۣ���� fFN��~(9����ďn�� ��\���0������!�
�s�      *   P   x�3�I-.�/OU�O��/�J��L��/�G�*��$�*T)$�df'&ge*$*�W��r�S*�2��ˁj�b���� !�
      +      x�+�4����� �a      (     x�U�An�0E��)� ����K�������rblF���ޫ��T������FDq
q�<��:#yH����X�9�xg���u:@"�6��0��RUG��m>��U V
Q��_@U�R�ZkUR��Bi�FYo$o퐦&� O�܃)�6�t�9@?$���&�-p>������.<:�g�e���뙃�IC��<�,yŊ�z�3F#���)���J�f���{wZQ�J"n��{1XݮN�����g���6�Ϭ�'�� ��֥<+)�/Bހ�     