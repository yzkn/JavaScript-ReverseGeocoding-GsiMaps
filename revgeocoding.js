// Copyright (c) 2024 YA-androidapp(https://github.com/yzkn) All rights reserved.


// 逆ジオコーディング
let GSI = {};

const reverseGeocoding = async (lat, lon) => {
    const getMuniCd = async (lat, lon) => {
        const response = await fetch(
            `https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${lat}&lon=${lon}`
        );
        if (!response.ok) {
            return undefined;
        }

        const lonLatToAddress = await response.json();
        return lonLatToAddress.results;
    };

    const getPrefecture = (muniCdInput) => {
        const muniCd =
            muniCdInput.substring(0, 1) === "0" ? muniCdInput.slice(1) : muniCdInput;
        const muniContents = GSI.MUNI_ARRAY[muniCd];
        if (!muniContents) {
            return undefined;
        }

        return muniContents.split(",")[3];
    };

    const result = await getMuniCd(lat, lon);
    const muniCd = result?.muniCd;
    const lv01Nm = result?.lv01Nm;
    if (!muniCd && !lv01Nm) {
        return '---';
    }

    return getPrefecture(muniCd) + lv01Nm;
};

// ジオコーディング

const geocoding = async (q) => {
    const response = await fetch(
        `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(q)}`
    );
    if (!response.ok) {
        return undefined;
    }

    const addressSearch = await response.json();
    return addressSearch.map((x) => JSON.stringify({ title: x.properties.title, lat: x.geometry.coordinates[1], lon: x.geometry.coordinates[0] })).join(',');
};
