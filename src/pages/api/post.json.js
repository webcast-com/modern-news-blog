export async function POST({ request }) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'excerpt', 'body', 'category', 'author'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Create new post object
    const newPost = {
      id: Date.now(), // Simple ID generation
      title: data.title,
      excerpt: data.excerpt,
      body: data.body,
      category: data.category,
      author: data.author,
      date: new Date().toISOString().slice(0, 10),
      image: data.image || `https://images.pexels.com/photos/${1000000 + Math.floor(Math.random() * 1000000)}/pexels-photo-${1000000 + Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop`
    };
    
    // In a real application, you would save this to a database
    // For now, we'll just return success with the created post
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Post created successfully',
      post: newPost
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid JSON data'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({
    success: true,
    message: 'POST endpoint is available',
    usage: {
      method: 'POST',
      contentType: 'application/json',
      requiredFields: ['title', 'excerpt', 'body', 'category', 'author'],
      optionalFields: ['image']
    }
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}