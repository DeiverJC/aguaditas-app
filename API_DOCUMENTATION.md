# Documentación de la API de Aguaditas

Esta documentación detalla los endpoints disponibles en el backend de Aguaditas, construidos principalmente con **Laravel Restify**.

---

## 🔐 Autenticación

Base URL: `{{base_url}}/api/`

### 1. Iniciar Sesión (Login)

- **Método**: `POST`
- **Endpoint**: `login`
- **Body (JSON)**:
    ```json
    {
        "email": "admin@aguaditas.com",
        "password": "password"
    }
    ```
- **Campos Requeridos**: `email`, `password`.
- **Respuesta Exitosa (200)**:
    ```json
    {
        "id": "1",
        "type": "users",
        "attributes": {
            "id": 1,
            "name": "Admin Aguaditas",
            "email": "admin@aguaditas.com",
            "role": "admin"
        },
        "meta": {
            "authorizedToShow": false,
            "authorizedToStore": false,
            "authorizedToUpdate": false,
            "authorizedToDelete": false,
            "token": "6|fs10zpUqj7Vy17ZTEmb6Vbk60kZFQmwH7ab64Ddy2b55c2d3"
        }
    }
    ```

### 2. Cerrar Sesión (Logout)

- **Método**: `POST`
- **Endpoint**: `logout`
- **Headers**: `Authorization: Bearer {token}`
- **Respuesta Exitosa (204 No Content)**

### 3. Perfil de Usuario Actual

- **Método**: `GET`
- **Endpoint**: `/restify/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Respuesta Exitosa (200)**: Datos del usuario autenticado.
    ```json
    {
        "data": {
            "id": "1",
            "type": "users",
            "attributes": {
                "id": 1,
                "name": "Admin Aguaditas",
                "email": "admin@aguaditas.com",
                "role": "admin"
            },
            "meta": {
                "authorizedToShow": true,
                "authorizedToStore": true,
                "authorizedToUpdate": true,
                "authorizedToDelete": true
            }
        }
    }
    ```

---

## 🛠 Repositorios Restify

Base URL: `{{base_url}}/api/restify/`
Todas las peticiones a estos endpoints requieren el header `Authorization: Bearer {token}`.

### 📦 Productos (`products`)

- **Listar**: `GET products`
    ```json
    {
        "meta": {
            "current_page": 1,
            "from": 1,
            "last_page": 1,
            "path": "http://localhost:8000/api/restify/products",
            "per_page": 15,
            "to": 1,
            "total": 1
        },
        "links": {
            "first": "http://localhost:8000/api/restify/products?page=1",
            "next": null,
            "path": "http://localhost:8000/api/restify/products",
            "prev": null,
            "filters": "/api/restify/products/filters"
        },
        "data": [
            {
                "id": "1",
                "type": "products",
                "attributes": {
                    "id": 1,
                    "name": "Agua eaque",
                    "sku": "99544355",
                    "unit_type": "paca",
                    "sale_price": "5566.93",
                    "created_at": "2026-02-14T20:46:17.000000Z",
                    "updated_at": "2026-02-14T20:46:17.000000Z"
                }
            }
        ]
    }
    ```
- **Ver**: `GET products/{id}`
    ```json
    {
        "data": {
            "id": "1",
            "type": "products",
            "attributes": {
                "id": 1,
                "name": "Agua eaque",
                "sku": "99544355",
                "unit_type": "paca",
                "sale_price": "5566.93",
                "created_at": "2026-02-14T20:46:17.000000Z",
                "updated_at": "2026-02-14T20:46:17.000000Z"
            },
            "meta": {
                "authorizedToShow": true,
                "authorizedToStore": true,
                "authorizedToUpdate": true,
                "authorizedToDelete": true
            }
        }
    }
    ```
- **Crear**: `POST products`
    - **Body**:
        ```json
        {
            "name": "Nombre del Producto",
            "sku": "SKU001",
            "unit_type": "und",
            "sale_price": 1500.0
        }
        ```
    - **Campos Requeridos**: `name`, `sku`, `unit_type`, `sale_price`.
- **Actualizar**: `PATCH products/{id}`
- **Eliminar**: `DELETE products/{id}`

### 👥 Clientes (`clients`)

- **Listar**: `GET clients`
    ```json
    {
        "meta": {
            "current_page": 1,
            "from": 1,
            "last_page": 1,
            "path": "http://localhost:8000/api/restify/clients",
            "per_page": 15,
            "to": 1,
            "total": 1
        },
        "links": {
            "first": "http://localhost:8000/api/restify/clients?page=1",
            "next": null,
            "path": "http://localhost:8000/api/restify/clients",
            "prev": null,
            "filters": "/api/restify/clients/filters"
        },
        "data": [
            {
                "id": "1",
                "type": "clients",
                "attributes": {
                    "id": 1,
                    "name": "Glover, Hammes and Jones",
                    "phone": "907.743.4989",
                    "address": "32576 Bayer Via Suite 819\nEast Don, WY 18431",
                    "created_at": "2026-02-14T20:46:17.000000Z",
                    "updated_at": "2026-02-14T20:46:17.000000Z"
                }
            }
        ]
    }
    ```
- **Ver**: `GET clients/{id}`
    ```json
    {
        "data": {
            "id": "1",
            "type": "clients",
            "attributes": {
                "id": 1,
                "name": "Glover, Hammes and Jones",
                "phone": "907.743.4989",
                "address": "32576 Bayer Via Suite 819\nEast Don, WY 18431",
                "created_at": "2026-02-14T20:46:17.000000Z",
                "updated_at": "2026-02-14T20:46:17.000000Z"
            },
            "meta": {
                "authorizedToShow": true,
                "authorizedToStore": true,
                "authorizedToUpdate": true,
                "authorizedToDelete": true
            }
        }
    }
    ```
- **Crear**: `POST clients`
    - **Body**:
        ```json
        {
            "name": "Nombre Cliente",
            "phone": "555-5555",
            "address": "Calle Falsa 123"
        }
        ```
    - **Campos Requeridos**: `name`.
- **Actualizar**: `PATCH clients/{id}`
- **Eliminar**: `DELETE clients/{id}`

### 🛒 Pedidos (`orders`)

- **Listar**: `GET orders`
    ```json
    {
        "meta": {
            "current_page": 1,
            "from": 1,
            "last_page": 1,
            "path": "http://localhost:8000/api/restify/orders",
            "per_page": 15,
            "to": 1,
            "total": 1
        },
        "links": {
            "first": "http://localhost:8000/api/restify/orders?page=1",
            "next": null,
            "path": "http://localhost:8000/api/restify/orders",
            "prev": null,
            "filters": "/api/restify/orders/filters"
        },
        "data": [
            {
                "id": "2",
                "type": "orders",
                "attributes": {
                    "id": 2,
                    "client_id": 3,
                    "user_id": 1,
                    "total_amount": "11133.86",
                    "status": "pending",
                    "items": [
                        {
                            "id": 1,
                            "order_id": 2,
                            "product_id": 1,
                            "quantity": 2,
                            "price_at_time": "5566.93",
                            "created_at": "2026-02-15T20:14:48.000000Z",
                            "updated_at": "2026-02-15T20:14:48.000000Z"
                        }
                    ],
                    "created_at": "2026-02-15T20:14:48.000000Z"
                }
            }
        ]
    }
    ```
- **Ver**: `GET orders/{id}`
    ```json
    {
        "data": {
            "id": "2",
            "type": "orders",
            "attributes": {
                "id": 2,
                "client_id": 3,
                "user_id": 1,
                "total_amount": "11133.86",
                "status": "pending",
                "items": [
                    {
                        "id": 1,
                        "order_id": 2,
                        "product_id": 1,
                        "quantity": 2,
                        "price_at_time": "5566.93",
                        "created_at": "2026-02-15T20:14:48.000000Z",
                        "updated_at": "2026-02-15T20:14:48.000000Z"
                    }
                ],
                "created_at": "2026-02-15T20:14:48.000000Z"
            },
            "meta": {
                "authorizedToShow": true,
                "authorizedToStore": true,
                "authorizedToUpdate": true,
                "authorizedToDelete": true
            }
        }
    }
    ```
- **Crear**: `POST orders`
    - **Body**:
        ```json
        {
            "client_id": 3,
            "items": [
                {
                    "product_id": 1,
                    "quantity": 2
                }
            ]
        }
        ```
    - **Campos Requeridos**: `client_id`, `items`.
- **Respuesta (201)**: Detalles del pedido creado y sus ítems.
    ```json
    {
        "data": {
            "client_id": 3,
            "user_id": 1,
            "status": "pending",
            "total_amount": 11133.86,
            "updated_at": "2026-02-15T20:14:48.000000Z",
            "created_at": "2026-02-15T20:14:48.000000Z",
            "id": 2,
            "items": [
                {
                    "id": 1,
                    "order_id": 2,
                    "product_id": 1,
                    "quantity": 2,
                    "price_at_time": "5566.93",
                    "created_at": "2026-02-15T20:14:48.000000Z",
                    "updated_at": "2026-02-15T20:14:48.000000Z"
                }
            ]
        }
    }
    ```

### 🔄 Ajustes de Inventario (`inventory-adjustments`)

- **Listar**: `GET inventory-adjustments` (soporta `?related=user,items`)
    ```json
    {
        "meta": {
            "current_page": 1,
            "from": 1,
            "last_page": 1,
            "path": "http://localhost:8000/api/restify/inventory-adjustments",
            "per_page": 15,
            "to": 1,
            "total": 1
        },
        "links": {
            "first": "http://localhost:8000/api/restify/inventory-adjustments?page=1",
            "next": null,
            "path": "http://localhost:8000/api/restify/inventory-adjustments",
            "prev": null,
            "filters": "/api/restify/inventory-adjustments/filters"
        },
        "data": [
            {
                "id": "1",
                "type": "inventory_adjustments",
                "attributes": {
                    "id": 1,
                    "user_id": 1,
                    "type": "input",
                    "description": "Prueba de ajuste",
                    "status": "finalized",
                    "finalized_at": "2026-02-15T01:08:37.000000Z",
                    "created_at": "2026-02-15T00:26:45.000000Z",
                    "updated_at": "2026-02-15T01:08:37.000000Z"
                },
                "relationships": {
                    "user": {
                        "id": 1,
                        "name": "Admin Aguaditas",
                        "email": "admin@aguaditas.com",
                        "email_verified_at": "2026-02-14T20:46:17.000000Z",
                        "role": "admin",
                        "created_at": "2026-02-14T20:46:17.000000Z",
                        "updated_at": "2026-02-14T20:46:17.000000Z"
                    }
                }
            }
        ]
    }
    ```
- **Ver**: `GET inventory-adjustments/{id}` (soporta `?related=user,items`)
    ```json
    {
        "data": {
            "id": "1",
            "type": "inventory_adjustments",
            "attributes": {
                "id": 1,
                "user_id": 1,
                "type": "input",
                "description": "Prueba de ajuste",
                "status": "finalized",
                "finalized_at": "2026-02-15T01:08:37.000000Z",
                "created_at": "2026-02-15T00:26:45.000000Z",
                "updated_at": "2026-02-15T01:08:37.000000Z"
            },
            "relationships": {
                "user": {
                    "id": 1,
                    "name": "Admin Aguaditas",
                    "email": "admin@aguaditas.com",
                    "email_verified_at": "2026-02-14T20:46:17.000000Z",
                    "role": "admin",
                    "created_at": "2026-02-14T20:46:17.000000Z",
                    "updated_at": "2026-02-14T20:46:17.000000Z"
                },
                "items": [
                    {
                        "id": 1,
                        "inventory_adjustment_id": 1,
                        "product_id": 1,
                        "quantity": 10,
                        "created_at": "2026-02-15T00:28:55.000000Z",
                        "updated_at": "2026-02-15T00:28:55.000000Z"
                    }
                ]
            },
            "meta": {
                "authorizedToShow": true,
                "authorizedToStore": true,
                "authorizedToUpdate": true,
                "authorizedToDelete": false
            }
        }
    }
    ```
- **Crear**: `POST inventory-adjustments`
    - **Body**:
        ```json
        {
            "user_id": 1,
            "type": "input", // input/output
            "description": "Prueba de ajuste 2"
        }
        ```
    - **Campos Requeridos**: `user_id`, `type` (`input` o `output`).
- **Actualizar**: `PATCH inventory-adjustments/{id}` (Solo si el status es `draft`).
- **Eliminar**: `DELETE inventory-adjustments/{id}` (Solo si el status es `draft`).

#### Acciones de Ajuste

- **Finalizar Ajuste**: `POST inventory-adjustments/{id}/actions/finalize`
    - **Efecto**: Actualiza el stock en la tabla `inventories` y crea registros en `inventory_movements`.

### 📝 Ítems de Ajuste (`inventory-adjustment-items`)

- **Crear**: `POST inventory-adjustment-items`
    - **Body**:
        ```json
        {
            "inventory_adjustment_id": 1,
            "product_id": 1,
            "quantity": 10
        }
        ```
    - **Campos Requeridos**: `inventory_adjustment_id`, `product_id`, `quantity`.
- **Actualizar**: `PATCH inventory-adjustment-items/{id}`
- **Eliminar**: `DELETE inventory-adjustment-items/{id}`

### 👤 Usuarios (`users`)

- **Listar**: `GET users`
    ```json
    {
        "meta": {
            "current_page": 1,
            "from": 1,
            "last_page": 1,
            "path": "http://localhost:8000/api/restify/users",
            "per_page": 15,
            "to": 2,
            "total": 2
        },
        "links": {
            "first": "http://localhost:8000/api/restify/users?page=1",
            "next": null,
            "path": "http://localhost:8000/api/restify/users",
            "prev": null,
            "filters": "/api/restify/users/filters"
        },
        "data": [
            {
                "id": "2",
                "type": "users",
                "attributes": {
                    "id": 2,
                    "name": "Test User",
                    "email": "test@aguaditas.com",
                    "role": "admin"
                }
            },
            {
                "id": "1",
                "type": "users",
                "attributes": {
                    "id": 1,
                    "name": "Admin Aguaditas",
                    "email": "admin@aguaditas.com",
                    "role": "admin"
                }
            }
        ]
    }
    ```
- **Ver**: `GET users/{id}`
    ```json
    {
        "data": {
            "id": "1",
            "type": "users",
            "attributes": {
                "id": 1,
                "name": "Admin Aguaditas",
                "email": "admin@aguaditas.com",
                "role": "admin"
            },
            "meta": {
                "authorizedToShow": true,
                "authorizedToStore": true,
                "authorizedToUpdate": true,
                "authorizedToDelete": true
            }
        }
    }
    ```
- **Crear**: `POST users` (Solo Admins)
    - **Body**:
        ```json
        {
            "name": "Nombre",
            "email": "correo@ejemplo.com",
            "role": "admin",
            "password": "password"
        }
        ```
    - **Campos Requeridos**: `name`, `email`, `role` (`admin` o `repartidor`), `password`.

---

## 📌 Parámetros Globales de Restify

- **Relaciones**: Usa `?related=relacion1,relacion2` para incluir datos relacionados.
- **Paginación**: Automática en el listado (Index).
- **Búsqueda**: `?search=valor` (Disponible si el repositorio lo tiene habilitado).
