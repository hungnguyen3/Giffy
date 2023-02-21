//
//  GiffyBoardView.swift
//  GiffyBoard
//
//  Created by Hachi on 2023-02-17.
//

import SwiftUI

struct GiffyBoardView: View {
    @State var images: [URL] = []
    @State var isImageCopied = false
    @State var hasFullAccess = false
    @State var collections: [CollectionDTO] = []
    @State var selectedCollectionId: Int?
    weak var keyboardViewController: KeyboardViewController?

    init(keyboardViewController: KeyboardViewController) {
        self.keyboardViewController = keyboardViewController
    }

    var body: some View {
        VStack {
            HStack {
                // Top navigation
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack {
                        ForEach(collections, id: \.collectionId) { collection in
                            Button(action: {
                                fetchImages(forCollection: collection)
                                selectedCollectionId = collection.collectionId
                            }) {
                                Text(collection.collectionName)
                                    .foregroundColor(selectedCollectionId == collection.collectionId ? .white : .black)
                                    .padding(.horizontal, 8)
                                    .background(selectedCollectionId == collection.collectionId ? Color.blue : Color.clear)
                            }
                            .buttonStyle(BorderlessButtonStyle())
                        }
                    }
                }
                .frame(height: 30)
                .padding(.horizontal, 8)
            }
            .background(Color.gray.opacity(0.2))

            // Main image grid
            ImageGridView(images: images, selectedCollectionId: selectedCollectionId, fetchImages: fetchImages)
        }
        .onAppear {
            fetchCollections()
            checkFullAccess()
        }
    }

    private func fetchImages(forCollection collection: CollectionDTO) {
        selectedCollectionId = collection.collectionId
        guard let url = URL(string: "API_LINK") else {
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

    private func fetchCollections() {
        guard let url = URL(string: "API_LINK") else {
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data, error == nil else {
                return
            }

            let decoder = JSONDecoder()
            do {
                let result = try decoder.decode(GiffyCollectionsResponse.self, from: data)
                DispatchQueue.main.async {
                    self.collections = result.data
                    if let firstCollection = self.collections.first {
                        self.selectedCollectionId = firstCollection.collectionId
                        self.fetchImages(forCollection: firstCollection)
                    }
                }
            } catch {
                print(error)
            }
        }.resume()
    }

    // TODO: Implement this, not working yet
    private func checkFullAccess() {
        self.hasFullAccess = true
    }
}
