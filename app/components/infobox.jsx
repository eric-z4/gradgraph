export default function InfoBox({
    className = ""
})
{

    return (
        <div className={className}>
            <div className="bg-white border border-[#bdbdbd] rounded-4xl h-8/10 p-4">
                <p className="text-4xl font-bold">GradGraph</p>
                <hr></hr>
                <p className="pt-3 text-left">Info</p>
            </div>
        </div>
    );
}