import Link from 'next/link';

const Home = () => {

    return (
        <>
            <Link href="/starknetJS">
                <a>Starknet.js example</a>
            </Link>
            <br/>
            <Link href="/starknetReact">
                <a>Starknet React example</a>
            </Link>
        </>
    )
}

export default Home;
