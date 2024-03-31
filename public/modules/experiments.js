export function myFn(event) {
    console.log("myButton clicked")
    myAsync(1000);
}

async function myAsync(ms) {
    console.log(`myWait called:    ${new Date()}`);
    try {
        const val = await new Promise((resFn, rjtFn) => setTimeout(() => rjtFn(new Date()), ms));
        console.log(`${ms}ms wait over:`, val);
    } catch (err) {
        console.log(`Promise rejected: ${err}`);
    }
}
