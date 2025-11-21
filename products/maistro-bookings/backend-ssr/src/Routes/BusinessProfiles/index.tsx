import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@maistro/ui";
import { MapPin } from "lucide-react";

import Header from "../../Components/Header";
import { useRouteData } from "../../State/DataRoute.context";
import { RouteName } from "../appRoutes";
import { BusinessProfile, MaistroImage } from "../../types/BusinessProfile";
import Image from "../BusinessProfile/Components/Image"
import { getBusinessProfiles } from "../../Api/BusinessProfile";
import ImagePlaceHolder from "../BusinessProfile/Components/ImagePlaceHolder";

const BusinessCard: React.FC<{ business: BusinessProfile }> = ({ business }) => {
    if (!business) {
        return null
    }

    const maistroImage: MaistroImage | undefined = business.Images?.Main || (business.Images?.Gallery && business.Images.Gallery[0])

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-100 h-full flex flex-col">
            <div className="relative h-[300px] bg-gray-100">
                {(maistroImage && maistroImage.Urls) ? (
                    <Image
                        variants={maistroImage}
                        alt={business.BusinessName}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <ImagePlaceHolder name={business.BusinessName} />
                )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                        {business.BusinessName}
                    </h3>
                </div>

                <div className="space-y-2 text-sm text-gray-600 flex-1">
                    {business.Address && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                            <span className="truncate line-clamp-1">{business.Address}</span>
                        </div>
                    )}

                    {business.BusinessType && business.BusinessType.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {business.BusinessType.slice(0, 2).map((type) => (
                                <span
                                    key={type}
                                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                >
                                    {type}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
const BusinessProfilesPage: React.FC = () => {
    const routeData = useRouteData<{
        items: BusinessProfile[];
        lastEvaluatedKey?: any;
    }>(RouteName.BUSINESS_PROFILES);

    const [businesses, setBusinesses] = React.useState<BusinessProfile[] | undefined>(routeData?.items);
    const [lastEvaluatedKey, setLastEvaluatedKey] = React.useState<any>(routeData?.lastEvaluatedKey);
    const location = useLocation();

     React.useEffect(() => {
        const fetchData = async () => {
            const searchParams = new URLSearchParams(location.search);
            const pagination = searchParams.get("pagination");
            
            try {
                const response = await getBusinessProfiles(pagination);
                const data = await response;
                setBusinesses(data.items);
                setLastEvaluatedKey(data.lastEvaluatedKey);
            } catch (error) {
                console.error("Failed to fetch businesses:", error);
            }
        };

        if (!businesses || location.search) {
            fetchData();
        }
    }, [location.search]);

    const sortedBusinesses = React.useMemo(() => {
        if (!businesses) return undefined;
        return [...businesses].sort((a, b) => {
            const aHasImage = !!(a.Images?.Main || (a.Images?.Gallery && a.Images.Gallery.length > 0));
            const bHasImage = !!(b.Images?.Main || (b.Images?.Gallery && b.Images.Gallery.length > 0));

            if (aHasImage && !bHasImage) return -1;
            if (!aHasImage && bHasImage) return 1;
            return 0;
        });
    }, [businesses]);

    if (!businesses && !routeData) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    return (
        <div className="bg-[#FFF8F6] min-h-screen font-sans">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Explorar Negocios</h1>
                    <p className="text-gray-600 mt-2">Encuentra los mejores servicios cerca de ti</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedBusinesses?.map((business) => (
                        <Link
                            key={business.BusinessId}
                            to={`/b/${business.Slug}`}
                            className="block h-full"
                        >
                            <BusinessCard business={business} />
                        </Link>
                    ))}
                </div>

                {businesses?.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No se encontraron negocios.</p>
                    </div>
                )}

                {lastEvaluatedKey && (
                    <div className="mt-12 flex justify-center">
                        <Link to={`/b?pagination=${encodeURIComponent(JSON.stringify(lastEvaluatedKey))}`}>
                            <Button variant="outline" className="px-8">
                                Cargar más
                            </Button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BusinessProfilesPage;
