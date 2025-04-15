import {createBrowserRouter} from "react-router-dom";
import Login from "../components/login/Login"
import CreateAccount from "../components/createAccount/CreateAccount";
import VerifyEmail from "../components/verifyEmail/VerifyEmail";
import List from "../components/list/List";
import UserDetails from "../components/userDetails/UserDetails";
import Categories from "../components/categories/Categories";
import AddCategory from "../components/adminActions/addCategory/AddCategory";
import EditCategory from "../components/adminActions/editCategory/EditCategory";
import AddSubCategories from "../components/adminActions/addSubCategories/AddSubCategories";
import SubCategories from "../components/subCategories/SubCategories";
import EditSubCategory from "../components/adminActions/editSubCategory/EditSubCategory";
import Products from "../components/products/Products";
import AddProduct from "../components/adminActions/addProduct/AddProduct";
import EditProduct from "../components/adminActions/editProduct/EditProduct";
import ProductsRating from "../components/productsRating/ProductsRating";
import News from "../components/news/News";
import AddNews from "../components/adminActions/addNews/AddNews";
import EditNews from "../components/adminActions/editNews/EditNews";
import NewGames from "../components/newGames/NewGames";
import AddNewGames from "../components/adminActions/addNewGames/AddNewGames";
import EditNewGames from "../components/adminActions/editNewGames/EditNewGames";
import Purchases from "../components/purchases/Purchases";

export const routes = (setMyMode) => createBrowserRouter([
    {
        path: '',
        element: <Login/>
    },
    {
        path: 'createaccount',
        element: <CreateAccount/>
    },
    {
      path: 'verify-email',
      element: <VerifyEmail />   
    },
    {
        path: 'list',
        element: <List/>
    },
    {
        path: 'details/:id',
        element: <UserDetails/>
    },
    {
        path: 'Categories',
        element: <Categories/>
    },
    {
        path: 'AddCategory',
        element: <AddCategory/>
    },
    {
        path: 'EditCategory/:id',
        element: <EditCategory/>
    },
    {
        path: 'SubCategories',
        element: <SubCategories/>
    },
    {
        path: 'AddSubCategories',
        element: <AddSubCategories/>
    },
    {
        path: 'EditSubCategory/:id',
        element: <EditSubCategory/>
    },
    {
        path: 'Products',
        element: <Products/>
    },
    {
        path: 'AddProduct',
        element: <AddProduct/>
    },
    {
        path: 'EditProduct/:id',
        element: <EditProduct/>
    },
    {
        path: 'ProductsRating',
        element: <ProductsRating/>
    },
    {
        path: 'News',
        element: <News/>
    },
    {
        path: 'AddNews',
        element: <AddNews/>
    },
    {
        path: 'EditNews/:id',
        element: <EditNews/>
    },
    {
        path: 'NewGames',
        element: <NewGames/>
    },
    {
        path: 'AddNewGames',
        element: <AddNewGames/>
    },
    {
        path: 'EditNewGames/:id',
        element: <EditNewGames/>
    },
    {
        path: 'Purchases',
        element: <Purchases/>
    }
])