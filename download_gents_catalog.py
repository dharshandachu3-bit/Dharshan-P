import os, shutil, urllib.request

LOCAL_GENTS = {
    'G001': 'src/assets/images/gents_bespoke_1793951567349.jpg',
    'G002': 'src/assets/images/gents_blue_pleated_1793953128036.jpg',
    'G019': 'src/assets/images/regal_sherwani_1793951585581.jpg',
    'G020': 'src/assets/images/regal_sherwani_1793951585581.jpg',
}

# Distinct verified menswear IDs from Unsplash
MENSWEAR_URLS = [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80'
]

for i in range(1, 51):
    gid = f'G{i:03d}'
    dest = f'public/designs/gents/{gid}.jpg'
    
    if gid in LOCAL_GENTS:
        src = LOCAL_GENTS[gid]
        shutil.copyfile(src, dest)
        print(f'{gid}: Copied local asset {src}')
    else:
        url = MENSWEAR_URLS[i % len(MENSWEAR_URLS)]
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req, timeout=8) as res:
                data = res.read()
                with open(dest, 'wb') as out:
                    out.write(data)
                print(f'{gid}: Downloaded {url[:45]}... ({len(data)} bytes)')
        except Exception as e:
            # fallback to local
            shutil.copyfile('src/assets/images/gents_bespoke_1793951567349.jpg', dest)

