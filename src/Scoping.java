public class Scoping {
  private String secret = "dontChangeMe!";

  public void printSecret() {
    System.out.println(secret);
  }

  public static void main(String[] args) {
    new Scoping().printSecret();
  }
}
