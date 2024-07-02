from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

DB_URL="mysql+pymysql://root:@localhost:3307/db_products"

engine=create_engine(DB_URL)

SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)

base=declarative_base()