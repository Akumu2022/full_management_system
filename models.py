from sqlalchemy import Column, String, Integer, Float, UniqueConstraint
from db import base

class Products(base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, unique=True)
    name = Column(String(30), nullable=False)
    descr = Column(String(100), nullable=True)
    quantity = Column(Integer, nullable=False)
    sku = Column(String(30), nullable=False, unique=True)  # SKU is unique
    price = Column(Float, nullable=False)  # Adding price column

    __table_args__ = (UniqueConstraint('name', 'sku', name='_name_sku_uc'),)
