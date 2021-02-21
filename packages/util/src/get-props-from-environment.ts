export function getPropsFromEnvironment<T>(target: T, props: (keyof T)[]) {
    const env = process.env as any

    props.forEach(name => {
        const upperCase = name.toString().toUpperCase()

        if (env.hasOwnProperty(upperCase) || env.hasOwnProperty(name)) {
            target[name] = env[upperCase] || env[name]
        }
    })
}