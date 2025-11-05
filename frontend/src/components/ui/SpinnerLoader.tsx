export default function SpinnerLoader({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <div
            className={`${className} border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin`}
            role="status"
            aria-label="Loading"
        />
    );
}
