from fastapi import FastAPI, Depends, status, HTTPException
from typing import Annotated
import models
from models import Products
from db import engine, SessionLocal
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
models.base.metadata.create_all(bind=engine)

class ProductsBase(BaseModel):
    name: str
    descr: str
    quantity: int
    sku: str  
    price: float 

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.post("/api/v1/add_product", status_code=status.HTTP_201_CREATED)
async def add_new_product(prod: ProductsBase, db: db_dependency):
    existing_prod = db.query(models.Products).filter(models.Products.sku == prod.sku).first()
    if existing_prod:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Such product already exists!")
    
    db_prod = models.Products(name=prod.name, descr=prod.descr, quantity=prod.quantity, sku=prod.sku, price=prod.price)
    db.add(db_prod)
    db.commit()
    return {"msg": "New product added successfully!"}

@app.get("/api/v1/add_product/{product_id}", status_code=status.HTTP_200_OK)
async def get_product(product_id: int, db:db_dependency):
    product=db.query(models.Products).filter(models.Products.id==product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="No such product")
    prod_details={
        "name":product.name,
        "sku":product.sku
    }
    return {"Details":prod_details}

@app.get("/api/v1/show_all_products")
async def show_all_products(db:db_dependency):
    Products=db.query(models.Products).all()
    if not Products:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return Products

@app.delete("/api/v1/delete_products/{product_id}",status_code=status.HTTP_200_OK)
async def delete_product(product_id: int,db:db_dependency):
    product=db.query(models.Products).filter(models.Products.id==product_id).first()
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="No such product to delete")
    db.delete(product)
    db.commit()
    return {"Msg":"Product deleted successfully!"}


@app.put("/api/v1/update_products/{product_id}",status_code=status.HTTP_200_OK)
async def update_product(product_id: int,prod: ProductsBase,db:db_dependency):
    product=db.query(models.Products).filter(models.Products.id==product_id).first()
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="No such product to delete")
    
    product.name = prod.name
    product.descr = prod.descr
    product.quantity = prod.quantity
    product.sku = prod.sku
    product.price = prod.price

    db.commit()
    return {"Msg":"Product updated successfully!"}

