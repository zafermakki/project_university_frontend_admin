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
        path: 'AddSubCategories',
        element: <AddSubCategories/>
    }
])