export default function InfoBox({
    className = ""
})
{
    const infoText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut enim ut odio maximus tempor sed sed mi. Curabitur quis tortor sed ex placerat posuere. Donec ipsum ipsum, fringilla non pellentesque in, scelerisque quis lacus. Integer aliquam sem elit, a mattis nibh porta id. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam et maximus velit. In ut urna urna. Nulla eu molestie dui, sed molestie dui. Aenean nisi urna, luctus eu pulvinar vitae, malesuada a arcu.Aliquam erat volutpat.In id laoreet arcu.Proin eget velit massa.Interdum et malesuada fames ac ante ipsum primis in faucibus.Maecenas augue augue, sollicitudin nec aliquet id, iaculis quis odio.In semper justo felis, ac tristique tellus condimentum eget.Duis feugiat risus ipsum, id vehicula nulla ultricies non.Sed iaculis, justo ut elementum suscipit, enim tortor efficitur diam, ac fermentum diam lectus sed ipsum.Pellentesque nec ornare dolor, at suscipit turpis.Nullam commodo ornare metus eget vehicula.Etiam eget est id nulla auctor consequat et at sapien.";

    /*
    * - Have text be changeable (Text as useState)
    * - Display info of...
    *     - Campus name
    *     - Fiscal Year?
    *     - Major percentage explanation?
    *     - Breakdown of major by gender? and undergrad/grad degree
    */

    return (
        <div className={className}>
            <div className="bg-white border border-[#bdbdbd] rounded-4xl h-8/10 p-4 overflow-auto">
                <p className="text-4xl font-bold">GradGraph</p>
                <hr></hr>
                <p className="pt-3 text-left">
                    {infoText}
                </p>
            </div>
        </div>
    );
}