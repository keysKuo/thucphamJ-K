create database final_project

use final_project


create Table Category (
	cid varchar(10) primary key,
	cname nvarchar(255),
	slug varchar(255),
)

insert into Category values ('WP', 'Whey Protein', 'whey-protein')
insert into Category values ('CP', 'Casein Protein', 'casein-protein')
insert into Category values ('HWP', 'Hydrolyzed Whey Protein', 'hydrolyzed-whey-protein')
insert into Category values ('MR', 'Meal Replacement', 'meal-replacement')
insert into Category values ('PB', 'Protein Bar', 'protein-bar')
insert into Category values ('VP', 'Vegan Protein', 'vegan-protein')

create table Product (
    pid varchar(10) primary key,
    pname nvarchar(255),
    price int,
    image varchar(255),
    description nvarchar(255),
    brand nvarchar(255),
    weight nvarchar(255),
	cid varchar(10),
    nImport int, 
    nExport int,
	slug varchar(255),
	constraint CHECK_IMPORT_EXPORT Check (nImport >= nExport),
	constraint FK_Category_Product_CID foreign key (cid) references Category (cid)
)

insert into Product values (
	'8925004050',
	'Rule 1 Proteins 5Lbs (2.23kg)',
	1830000,
	'/img/WP/wp1.png', 
	'Whey Rule 1 Protein là sản phẩm phát triển cơ bắp cung cấp 100% Whey Isolate và Hydrolyzed hấp thu nhanh. Whey Rule 1 protein nhập khẩu chính hãng, cam kết chất lượng, giá rẻ nhất tại Hà Nội & Tp.HCM.',
	'Rule 1',
	'5Lbs ~ 2.27kg',
	'WP',
	300,
	202,
	'rule-1-proteins-5lbs-2.23kg'
)

insert into Product values (
	'0516031203',
	'Whey ISO HD 4.9Lbs (2.2kg)',
	1580000,
	'/img/WP/wp2.png', 
	'Whey BPI ISO HD là sản phẩm 100% Whey Isolate hỗ trợ phục hồi, phát triển cơ bắp hiệu quả. Cam kết nhập khẩu chính hãng uy tín và giá rẻ nhất tại Hà Nội, TpHCM.',
	'BPI Sport',
	'4.9Lbs ~ 2.2kg',
	'WP',
	180,
	30,
	'whey-iso-hd-4.9lbs-2.2kg'
)


insert into Product values (
	'8927028669',
	'Whey Gold Standard 5Lbs (2.3kg)',
	1790000,
	'/img/WP/wp3.png', 
	'Whey Gold Standard 100% là sản phẩm Whey tăng cơ với hơn 30 năm uy tín thương hiệu hàng đầu thế giới,cam kết chính hãng, chất lượng và giá rẻ nhất Hà Nội, TpHCM',
	'Optimum Nutrition',
	'5Lbs ~ 2.27KG',
	'WP',
	150,
	123,
	'whey-gold-standard-5lbs-2.3kg'
)


insert into Product values (
	'8927026382',
	'Platinum HydroWhey 3.5Lbs (1.59kg)',
	1900000,
	'/img/HWP/hwp1.png', 
	'Platinum HydroWhey ON là sản phẩm tăng cơ bắp hiệu quả nhất với 100% Whey thủy phân hấp thu nhanh, chính hãng Optimum Nutrition và giá tốt nhất tại Hà Nội TPHCM.',
	'Optimum Nutrition',
	'3.5Lbs ~ 1.59kg',
	'HWP',
	150,
	25,
	'platinum-hydrowhey-3.5lbs-1.59kg'
)

insert into Product values (
	'2723026351',
	'Labrada Lean Pro 8 5Lbs (2.3kg)',
	1690000,
	'/img/MR/mr1.png', 
	'Bữa ăn nhanh, thông minh với Labrada Lean Pro 8 5lbs (2,27kg) sẽ giúp cho cơ bắp của bạn lớn hơn, mạnh mẽ hơn và gọn gàng nhanh chóng hơn bao giờ hết.',
	'Labrada',
	'5lbs ~ 2.27kg',
	'MR',
	120,
	25,
	'labrada-lean-pro-8-5lbs-2.27kg'
)

select * from product

create table Account (
    acc_id varchar(10) primary key,
    password varchar(255),
    role varchar(255),
    discount int,
    name nvarchar(255),
    phone char(10),
    address nvarchar(255),
    email varchar(255),
)

create table Import (
    imp_id varchar(10) primary key,
    total int,
    created_at date,
    status varchar(255),
    acc_id varchar(10),
    constraint FK_ACCOUNT_IMPORT_ACCID foreign key (acc_id) references Account (acc_id)
)

create table ImportDetail (
    imp_id varchar(10),
    pid varchar(10),
    primary key (imp_id, pid),
    
    constraint FK_IMPORT_IMPORTDETAIL_IMPID foreign key (imp_id) references Import(imp_id),
    constraint FK_PRODUCT_IMPORTDETAIL_PID foreign key (pid) references Product(pid)
)

create table Export (
    exp_id varchar(10) primary key,
    total int,
    created_at date,
    status varchar(255),
    acc_id varchar(10),
    constraint FK_ACCOUNT_EXPORT_ACCID foreign key (acc_id) references Account (acc_id)
)

create table ExportDetail (
    exp_id varchar(10),
    pid varchar(10),

    primary key (exp_id, pid),
    constraint FK_EXPORT_EXPORTDETAIL_EXPID foreign key (exp_id) references Export (exp_id),
    constraint FK_PRODUCT_EXPORTDETAIL_PID foreign key (pid) references Product (pid)
)

