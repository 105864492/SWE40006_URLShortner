function convertToShortLink(longUrl) {
    if (longToShort.has(longUrl)) {
        return BASEUrl + longToShort.get(longUrl);
    }

    const id = counter++;
    const shortUrl = BASE62[id % 62] + BASE62[Math.floor(id / 62) % 62] + BASE62[Math.floor(id / 62 / 62) % 62];
    shortToLong.set(shortUrl, longUrl);
    longToShort.set(longUrl, shortUrl);

    return BASEUrl + shortUrl;
}
