//
//  GiffyBoardView.swift
//  GiffyBoard
//
//  Created by Hachi on 2023-02-17.
//

import SwiftUI

struct GiffyResponse: Codable {
    let data: [GiffyDTO]
}

struct GiffyDTO: Codable {
    let giffyId: Int
    let collectionId: Int
    let firebaseUrl: String
    let firebaseRef: String
    let giffyName: String
    let likes: Int
}

struct RemoteImage: View {
    let url: URL
    
    @State private var image: UIImage?
    
    var body: some View {
        if let image = image {
            Image(uiImage: image)
                .resizable()
                .aspectRatio(contentMode: .fit)
        } else {
            Color.gray
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .onAppear(perform: loadImage)
        }
    }
    
    private func loadImage() {
        URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data, error == nil else {
                print("Error loading image: \(String(describing: error))")
                return
            }
            DispatchQueue.main.async {
                self.image = UIImage(data: data)
            }
        }.resume()
    }
}

struct GiffyBoardView: View {
    @State var images: [URL] = []
    @State var isImageCopied = false
    weak var keyboardViewController: KeyboardViewController?
    
    init(keyboardViewController: KeyboardViewController) {
        self.keyboardViewController = keyboardViewController
    }
    
    var body: some View {
        VStack {
            ScrollView {
                LazyVGrid(columns: Array(repeating: GridItem(), count: 3)) {
                    ForEach(images, id: \.self) { imageURL in
                        Button(action: {
                            insertImage(imageURL)
                        }) {
                            RemoteImage(url: imageURL)
                                .aspectRatio(contentMode: .fit)
                                .padding(4)
                        }
                    }
                }
            }
            if isImageCopied {
                HStack {
                    Spacer()
                    Text("Image copied to clipboard")
                        .padding(8)
                        .background(Color.black.opacity(0.7))
                        .foregroundColor(.white)
                        .cornerRadius(8)
                        .onAppear {
                            DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                                withAnimation {
                                    self.isImageCopied = false
                                }
                            }
                        }
                    Spacer()
                }
            }
        }
        .onAppear {
            fetchImages()
        }
    }
    
    private func fetchImages() {
        guard let url = URL(string: "API_URL") else {
            return
        }
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data, error == nil else {
                return
            }
            
            let decoder = JSONDecoder()
            do {
                let result = try decoder.decode(GiffyResponse.self, from: data)
                DispatchQueue.main.async {
                    self.images = result.data.map { URL(string: $0.firebaseUrl)! }
                }
            } catch {
                print(error)
            }
        }.resume()
    }

    private func insertImage(_ url: URL) {
        URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data, error == nil else {
                print("Error loading image: \(String(describing: error))")
                return
            }
            if let image = UIImage(data: data) {
                DispatchQueue.main.async {
                    let pasteboard = UIPasteboard.general
                    pasteboard.image = image
                    withAnimation {
                        self.isImageCopied = true
                    }
                }
            }
        }.resume()
    }
}
