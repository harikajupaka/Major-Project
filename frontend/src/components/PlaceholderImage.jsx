const imageSources = {
  'banner_model.jpg': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=640&q=80',
  'men.jpg': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=240&q=80',
  'women.jpg': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=240&q=80',
  'children.jpg': 'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?auto=format&fit=crop&w=240&q=80',
  'stylist_1.jpg': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'stylist_2.jpg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'stylist_3.jpg': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  'women_haircare_icon.jpg': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=240&q=80',
  'women_bodycare_icon.jpg': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
  'women_makeup_icon.jpg': 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=240&q=80',
  'women_skincare_icon.jpg': 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=240&q=80',
  'men_haircare_icon.jpg': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=240&q=80',
  'men_bodycare_icon.jpg': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=240&q=80',
  'men_beardcare_icon.jpg': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=240&q=80',
  'children_haircare_icon.jpg': 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=240&q=80'
  , 'women_stylist_1.jpg': 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80'
  , 'women_stylist_2.jpg': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'
  , 'women_stylist_3.jpg': 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80'
  , 'children_stylist_1.jpg': 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=400&q=80'
  , 'children_stylist_2.jpg': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80'
  , 'children_stylist_3.jpg': 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=400&q=80'
};

const PlaceholderImage = ({ name, width = '100%', height = '150px', style }) => {
  return (
    <div
      style={{
        width,
        height,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f5c7a9, #d99a8b)',
        borderRadius: '8px',
        ...style,
      }}
    >
      <img
        src={imageSources[name] || imageSources['stylist_1.jpg']}
        alt={name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ')}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
};

export default PlaceholderImage;
