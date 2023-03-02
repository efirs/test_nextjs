import Link from 'next/link';

const Menu = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link href="/users">Users</Link>
                </li>
                
                <li>
                    <Link href="/orders">Orders</Link>
                </li>
                
                <li>
                    <Link href="/products">Products</Link>
                </li>
                
            </ul>
        </nav>
    );
};

export default Menu;