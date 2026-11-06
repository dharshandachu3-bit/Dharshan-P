import os, shutil, urllib.request

LOCAL_BLOUSES = {
    'L001': 'src/assets/images/blouse_white_gold_temple_1793953153255.jpg',
    'L002': 'src/assets/images/blouse_boat_neck_1793952976725.jpg',
    'L003': 'src/assets/images/blouse_couture_1793951549448.jpg',
    'L004': 'src/assets/images/blouse_green_zardozi_1793953058653.jpg',
    'L005': 'src/assets/images/blouse_aqua_teardrop_1793953106002.jpg',
    'L006': 'src/assets/images/blouse_purple_tassels_1793953082860.jpg',
    'L016': 'src/assets/images/bridal_lehenga_1793951603169.jpg',
}

# 43 distinct verified URLs for L007-L015, L017-L050
URL_MAP = {
    'L007': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    'L008': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    'L009': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    'L010': 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    'L011': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
    'L012': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    'L013': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    'L014': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    'L015': 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    'L017': 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=800&q=80',
    'L018': 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&w=800&q=80',
    'L019': 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    'L020': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    'L021': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    'L022': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    'L023': 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80',
    'L024': 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80',
    'L025': 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
    'L026': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'L027': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'L028': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    'L029': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    'L030': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    'L031': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    'L032': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    'L033': 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
    'L034': 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    'L035': 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    'L036': 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80',
    'L037': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    'L038': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    'L039': 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
    'L040': 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    'L041': 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80',
    'L042': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    'L043': 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=800&q=80',
    'L044': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80',
    'L045': 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80',
    'L046': 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=800&q=80',
    'L047': 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=800&q=80',
    'L048': 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=800&q=80',
    'L049': 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    'L050': 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80'
}

for i in range(1, 51):
    did = f'L{i:03d}'
    dest = f'public/designs/ladies/{did}.jpg'
    
    if did in LOCAL_BLOUSES:
        src = LOCAL_BLOUSES[did]
        shutil.copyfile(src, dest)
        print(f'{did}: Copied local asset {src}')
    elif did in URL_MAP:
        url = URL_MAP[did]
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req, timeout=8) as res:
                data = res.read()
                with open(dest, 'wb') as out:
                    out.write(data)
                print(f'{did}: Downloaded from {url[:45]}... ({len(data)} bytes)')
        except Exception as e:
            print(f'{did}: Error downloading: {e}')

